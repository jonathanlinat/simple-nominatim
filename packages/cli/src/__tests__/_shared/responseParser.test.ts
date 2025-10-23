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

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("successful responses", () => {
    it("should output JSON string for object response", async () => {
      const response = { place_id: 123, name: "Test Place" };
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should output JSON string for array response", async () => {
      const response = [
        { place_id: 1, name: "Place 1" },
        { place_id: 2, name: "Place 2" },
      ];
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should output JSON string for string response", async () => {
      const response = "OK";
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should output JSON string for number response", async () => {
      const response = 42;
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should output JSON string for boolean response", async () => {
      const response = true;
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should output JSON string for null response", async () => {
      const response = null;
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle complex nested objects", async () => {
      const response = {
        place_id: 123,
        address: {
          city: "London",
          country: "UK",
          coordinates: {
            lat: 51.5074,
            lon: -0.1278,
          },
        },
        tags: ["city", "capital"],
      };
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle empty object", async () => {
      const response = {};
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle empty array", async () => {
      const response: unknown[] = [];
      const promise = Promise.resolve(response);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(response));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should output error message for Error instance", async () => {
      const error = new Error("Network failure");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Ups! Something went wrong... Network failure",
      );
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should output error message for string error", async () => {
      const error = "String error message";
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Ups! Something went wrong... String error message",
      );
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should output error message for number error", async () => {
      const error = 404;
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Ups! Something went wrong... 404",
      );
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should handle HTTP error", async () => {
      const error = new Error("HTTP error! Status: 400. Text: Bad Request");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Ups! Something went wrong... HTTP error! Status: 400. Text: Bad Request",
      );
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should handle custom error objects", async () => {
      const error = { message: "Custom error", code: "ERR_CUSTOM" };
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalled();
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
    });

    it("should wait for promise to reject", async () => {
      const error = new Error("Async error");
      const promise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(error), 10);
      });

      await responseParser(promise);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Ups! Something went wrong... Async error",
      );
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
