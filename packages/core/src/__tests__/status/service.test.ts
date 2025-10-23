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

import { beforeEach, describe, expect, it, vi } from "vitest";

import { serviceStatus } from "../../status/service";

describe("serviceStatus", () => {
  const mockResponse = {
    status: 0,
    message: "OK",
    data_updated: "2025-10-23T10:00:00+00:00",
    software_version: "4.4.0",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    // @ts-expect-error - Overriding global fetch for testing
    global.fetch = undefined;
  });

  describe("basic functionality", () => {
    it("should check service status", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await serviceStatus({ format: "json" });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should construct URL for status endpoint", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await serviceStatus({ format: "json" });

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      const url = callArgs![0] as string;
      expect(url).toContain("status?");
    });

    it("should return status object", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await serviceStatus({ format: "json" });

      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("message");
    });
  });

  describe("format options", () => {
    it("should work with JSON format", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await serviceStatus({ format: "json" });

      expect(result).toEqual(mockResponse);
    });

    it("should work with text format", async () => {
      const textResponse = "OK";
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => textResponse,
      });

      const result = await serviceStatus({ format: "text" });

      expect(result).toBe(textResponse);
    });
  });

  describe("cache options", () => {
    it("should work with cache disabled", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await serviceStatus({
        format: "json",
        cache: { enabled: false },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should work with custom cache settings", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await serviceStatus({
        format: "json",
        cache: { enabled: true, maxSize: 50, ttl: 10000 },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("rate limit options", () => {
    it("should work with rate limiting disabled", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await serviceStatus({
        format: "json",
        rateLimit: { enabled: false },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should work with custom rate limit settings", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await serviceStatus({
        format: "json",
        rateLimit: { enabled: true, limit: 5 },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("retry options", () => {
    it("should work with retry disabled", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await serviceStatus({
        format: "json",
        retry: { enabled: false },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should retry on failure", async () => {
      let callCount = 0;
      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error("Network error");
        }

        return { ok: true, json: async () => mockResponse };
      });

      const result = await serviceStatus({
        format: "json",
        retry: {
          enabled: true,
          maxAttempts: 2,
          initialDelay: 10,
          useJitter: false,
        },
        rateLimit: { enabled: false },
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("error handling", () => {
    it("should throw on HTTP error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(
        serviceStatus({
          format: "json",
          retry: { enabled: false },
        }),
      ).rejects.toThrow("HTTP error");
    });

    it("should throw on network error", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network failure"));

      await expect(
        serviceStatus({
          format: "json",
          retry: { enabled: false },
        }),
      ).rejects.toThrow("Network failure");
    });
  });

  describe("response variations", () => {
    it("should handle OK status", async () => {
      const okResponse = {
        status: 0,
        message: "OK",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => okResponse,
      });

      const result = await serviceStatus({ format: "json" });

      expect(result).toEqual(okResponse);
    });

    it("should handle status with data timestamp", async () => {
      const timestampResponse = {
        status: 0,
        message: "OK",
        data_updated: "2025-10-23T10:00:00+00:00",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => timestampResponse,
      });

      const result = await serviceStatus({ format: "json" });

      expect(result).toEqual(timestampResponse);
    });

    it("should handle status with version info", async () => {
      const versionResponse = {
        status: 0,
        message: "OK",
        software_version: "4.4.0",
        database_version: "4.4.0",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => versionResponse,
      });

      const result = await serviceStatus({ format: "json" });

      expect(result).toEqual(versionResponse);
    });
  });

  describe("integration", () => {
    it("should work with all options combined", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await serviceStatus({
        format: "json",
        cache: { enabled: true },
        rateLimit: { enabled: true },
        retry: { enabled: true },
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should work with minimal options", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await serviceStatus({ format: "json" });

      expect(result).toEqual(mockResponse);
    });
  });
});
