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
    it("should handle rate limit errors with specific message", async () => {
      await responseParser(
        Promise.reject(
          new Error("HTTP error! Status: 429. Text: Too Many Requests"),
        ),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Rate limit exceeded. Please try again later or reduce request frequency.",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle 5xx server errors with specific message", async () => {
      await responseParser(
        Promise.reject(
          new Error("HTTP error! Status: 500. Text: Internal Server Error"),
        ),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Nominatim API is currently unavailable. Please try again later.",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockClear();
      processExitSpy.mockClear();
      await responseParser(
        Promise.reject(
          new Error("HTTP error! Status: 503. Text: Service Unavailable"),
        ),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Nominatim API is currently unavailable. Please try again later.",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle 4xx client errors with specific message", async () => {
      await responseParser(
        Promise.reject(new Error("HTTP error! Status: 400. Text: Bad Request")),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Request failed. Please check your parameters and try again.",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockClear();
      processExitSpy.mockClear();
      await responseParser(
        Promise.reject(new Error("HTTP error! Status: 404. Text: Not Found")),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Request failed. Please check your parameters and try again.",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle network errors with specific message", async () => {
      await responseParser(Promise.reject(new Error("Network failure")));
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Network connection failed. Please check your internet connection.",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockClear();
      processExitSpy.mockClear();
      await responseParser(Promise.reject(new Error("network timeout")));
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Network connection failed. Please check your internet connection.",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockClear();
      processExitSpy.mockClear();
      await responseParser(Promise.reject(new Error("fetch failed")));
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Network connection failed. Please check your internet connection.",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle retry exhaustion errors with specific message", async () => {
      await responseParser(
        Promise.reject(new Error("Request failed after all retry attempts")),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Request failed after multiple retry attempts. Please try again later.",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle generic errors with error message", async () => {
      await responseParser(Promise.reject(new Error("Generic error")));
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error: Generic error");
      expect(processExitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockClear();
      processExitSpy.mockClear();
      await responseParser(Promise.reject("String error message"));
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error: String error message",
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockClear();
      processExitSpy.mockClear();
      await responseParser(Promise.reject(404));
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error: 404");
      expect(processExitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockClear();
      processExitSpy.mockClear();
      await responseParser(
        Promise.reject({ message: "Custom error", code: "ERR_CUSTOM" }),
      );
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
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

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it("should wait for promise to reject", async () => {
      const error = new Error("Async error");
      const promise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(error), 10);
      });

      await responseParser(promise);

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
