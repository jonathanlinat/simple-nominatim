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

import type { MockInstance } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { responseParser } from "../../_shared/responseParser";

describe("shared:response-parser", () => {
  let consoleLogSpy: MockInstance<typeof console.log>;
  let consoleErrorSpy: MockInstance<typeof console.error>;
  let processExitSpy: MockInstance<typeof process.exit>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    processExitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful responses", () => {
    it("should output JSON response to console", async () => {
      const mockResponse = { lat: "48.8566", lon: "2.3522", name: "Paris" };
      const promise = Promise.resolve(mockResponse);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(mockResponse));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it("should handle array responses", async () => {
      const mockResponse = [
        { place_id: 1, name: "Paris" },
        { place_id: 2, name: "London" },
      ];
      const promise = Promise.resolve(mockResponse);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(mockResponse));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it("should handle empty object responses", async () => {
      const mockResponse = {};
      const promise = Promise.resolve(mockResponse);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(mockResponse));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it("should handle null responses", async () => {
      const mockResponse = null;
      const promise = Promise.resolve(mockResponse);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(mockResponse));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(processExitSpy).not.toHaveBeenCalled();
    });

    it("should handle string responses", async () => {
      const mockResponse = "OK";
      const promise = Promise.resolve(mockResponse);

      await responseParser(promise);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(mockResponse));
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(processExitSpy).not.toHaveBeenCalled();
    });
  });

  describe("rate limit errors", () => {
    it("should handle HTTP 429 rate limit error", async () => {
      const error = new Error("HTTP error! Status: 429");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Rate limit exceeded. Please try again later or reduce request frequency.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("server errors", () => {
    it("should handle HTTP 500 server error", async () => {
      const error = new Error("HTTP error! Status: 500");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Nominatim API is currently unavailable. Please try again later.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle HTTP 502 bad gateway error", async () => {
      const error = new Error("HTTP error! Status: 502");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Nominatim API is currently unavailable. Please try again later.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle HTTP 503 service unavailable error", async () => {
      const error = new Error("HTTP error! Status: 503");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Nominatim API is currently unavailable. Please try again later.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("client errors", () => {
    it("should handle HTTP 400 bad request error", async () => {
      const error = new Error("HTTP error! Status: 400");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Request failed. Please check your parameters and try again.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle HTTP 404 not found error", async () => {
      const error = new Error("HTTP error! Status: 404");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Request failed. Please check your parameters and try again.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("network errors", () => {
    it("should handle network error with Network keyword", async () => {
      const error = new Error("Network request failed");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Network connection failed. Please check your internet connection.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle network error with lowercase network keyword", async () => {
      const error = new Error("network timeout occurred");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Network connection failed. Please check your internet connection.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle fetch failed error", async () => {
      const error = new Error("fetch failed");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Network connection failed. Please check your internet connection.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("retry errors", () => {
    it("should handle retry exhaustion error", async () => {
      const error = new Error("Request failed after all retry attempts");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Request failed after multiple retry attempts. Please try again later.",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("generic errors", () => {
    it("should handle generic Error instances", async () => {
      const error = new Error("Something went wrong");
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error: Something went wrong",
      );
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle non-Error thrown values", async () => {
      const error = "String error";
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error: String error");
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle numeric error values", async () => {
      const error = 404;
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error: 404");
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle object error values", async () => {
      const error = { code: "ERR_UNKNOWN", details: "Unknown error" };
      const promise = Promise.reject(error);

      await responseParser(promise);

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error: [object Object]");
      expect(processExitSpy).toHaveBeenCalledTimes(1);
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });
});
