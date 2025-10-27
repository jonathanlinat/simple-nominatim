/**
 * MIT License
 *
 * Copyright (c) 2023-2025 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { responseParser } from "../../_shared/responseParser";

describe("responseParser", () => {
  let consoleLogSpy: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.fn>;
  let processExitSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    processExitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    vi.useRealTimers();
  });

  describe("successful responses", () => {
    it("should output JSON string for various response types", async () => {
      const objectResponse = { place_id: 123, name: "Test Place" };

      await responseParser(Promise.resolve(objectResponse));
      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify(objectResponse),
      );

      consoleLogSpy.mockClear();
      const arrayResponse = [
        { place_id: 1, name: "Place 1" },
        { place_id: 2, name: "Place 2" },
      ];

      await responseParser(Promise.resolve(arrayResponse));
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(arrayResponse));

      consoleLogSpy.mockClear();
      await responseParser(Promise.resolve("OK"));
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify("OK"));

      consoleLogSpy.mockClear();
      await responseParser(Promise.resolve(42));
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(42));

      consoleLogSpy.mockClear();
      await responseParser(Promise.resolve(true));
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(true));

      consoleLogSpy.mockClear();
      await responseParser(Promise.resolve(null));
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(null));

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle complex and empty data structures", async () => {
      const complexResponse = {
        place_id: 123,
        address: {
          city: "London",
          country: "UK",
          coordinates: { lat: 51.5074, lon: -0.1278 },
        },
        tags: ["city", "capital"],
      };

      await responseParser(Promise.resolve(complexResponse));
      expect(consoleLogSpy).toHaveBeenCalledWith(
        JSON.stringify(complexResponse),
      );

      consoleLogSpy.mockClear();
      await responseParser(Promise.resolve({}));
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify({}));

      consoleLogSpy.mockClear();
      await responseParser(Promise.resolve([]));
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify([]));

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    const errorScenarios = [
      {
        name: "rate limit errors",
        error: new Error("HTTP error! Status: 429. Text: Too Many Requests"),
        expectedMessage:
          "Rate limit exceeded. Please try again later or reduce request frequency.",
      },
      {
        name: "500 server errors",
        error: new Error(
          "HTTP error! Status: 500. Text: Internal Server Error",
        ),
        expectedMessage:
          "Nominatim API is currently unavailable. Please try again later.",
      },
      {
        name: "503 server errors",
        error: new Error("HTTP error! Status: 503. Text: Service Unavailable"),
        expectedMessage:
          "Nominatim API is currently unavailable. Please try again later.",
      },
      {
        name: "400 client errors",
        error: new Error("HTTP error! Status: 400. Text: Bad Request"),
        expectedMessage:
          "Request failed. Please check your parameters and try again.",
      },
      {
        name: "404 client errors",
        error: new Error("HTTP error! Status: 404. Text: Not Found"),
        expectedMessage:
          "Request failed. Please check your parameters and try again.",
      },
      {
        name: "network failures",
        error: new Error("Network failure"),
        expectedMessage:
          "Network connection failed. Please check your internet connection.",
      },
      {
        name: "network timeouts",
        error: new Error("network timeout"),
        expectedMessage:
          "Network connection failed. Please check your internet connection.",
      },
      {
        name: "fetch failures",
        error: new Error("fetch failed"),
        expectedMessage:
          "Network connection failed. Please check your internet connection.",
      },
      {
        name: "retry exhaustion",
        error: new Error("Request failed after all retry attempts"),
        expectedMessage:
          "Request failed after multiple retry attempts. Please try again later.",
      },
    ];

    for (const { name, error, expectedMessage } of errorScenarios) {
      it(`should handle ${name} with specific message`, async () => {
        await responseParser(Promise.reject(error));
        expect(consoleErrorSpy).toHaveBeenCalledWith(expectedMessage);
        expect(processExitSpy).toHaveBeenCalledWith(1);
      });
    }

    it("should handle generic errors with error message", async () => {
      const errorCases = [
        { input: new Error("Generic error"), expected: "Error: Generic error" },
        {
          input: "String error message",
          expected: "Error: String error message",
        },
        { input: 404, expected: "Error: 404" },
        {
          input: { message: "Custom error", code: "ERR_CUSTOM" },
          expected: null,
        },
      ];

      for (const { input, expected } of errorCases) {
        await responseParser(Promise.reject(input));

        if (expected) {
          expect(consoleErrorSpy).toHaveBeenCalledWith(expected);
        } else {
          expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        }

        expect(processExitSpy).toHaveBeenCalledWith(1);
        consoleErrorSpy.mockClear();
        processExitSpy.mockClear();
      }
    });

    it("should not log to stdout on error", async () => {
      await responseParser(Promise.reject(new Error("Test error")));
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe("promise handling", () => {
    it("should wait for promise to resolve", async () => {
      const response = { data: "test" };
      const promise = new Promise<typeof response>((resolve) => {
        setTimeout(() => resolve(response), 10);
      });

      const resultPromise = responseParser(promise);

      await vi.advanceTimersByTimeAsync(10);
      await resultPromise;

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it("should wait for promise to reject", async () => {
      const error = new Error("Async error");
      const promise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(error), 10);
      });

      const resultPromise = responseParser(promise);

      await vi.advanceTimersByTimeAsync(10);
      await resultPromise;

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Async error");
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("type safety", () => {
    it("should handle typed generic responses", async () => {
      interface Place {
        place_id: number;
        name: string;
      }

      const response: Place = { place_id: 123, name: "Test" };
      const promise = Promise.resolve(response);

      await responseParser<Place>(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
    });

    it("should handle unknown type responses", async () => {
      const response: unknown = { data: "test" };
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
    });
  });
});
