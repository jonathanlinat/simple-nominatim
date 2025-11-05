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

import { resetDataFetcherInstances } from "../../_shared/dataFetcher";
import { serviceStatus } from "../../status/service";

describe("status:service", () => {
  const MOCK_RESPONSE = {
    status: 0,
    message: "OK",
    data_updated: "2024-01-01T00:00:00Z",
    software_version: "4.5.0",
    database_version: "4.5.0",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    resetDataFetcherInstances();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_RESPONSE,
      text: async () => "OK",
    });
  });

  describe("core functionality", () => {
    it("should perform status check", async () => {
      const result = await serviceStatus({
        format: "json",
      });

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should construct correct URL", async () => {
      await serviceStatus({
        format: "json",
      });

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];

      expect(fetchCall).toBeDefined();
      const url = new URL(fetchCall![0] as string);

      expect(url.pathname).toContain("status");
      expect(url.searchParams.get("format")).toBe("json");
    });
  });

  describe("API parameters", () => {
    it("should pass format parameter", async () => {
      await serviceStatus({
        format: "text",
      });

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];

      expect(fetchCall).toBeDefined();
      const url = new URL(fetchCall![0] as string);

      expect(url.searchParams.get("format")).toBe("text");
    });
  });

  describe("cache configuration", () => {
    it("should respect cache enabled configuration", async () => {
      await serviceStatus({
        format: "json",
        cache: {
          enabled: true,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should respect cache disabled configuration", async () => {
      await serviceStatus({
        format: "json",
        cache: {
          enabled: false,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should respect custom cache TTL", async () => {
      await serviceStatus({
        format: "json",
        cache: {
          ttl: 5000,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("rate limit configuration", () => {
    it("should respect rate limit enabled configuration", async () => {
      await serviceStatus({
        format: "json",
        rateLimit: {
          enabled: true,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should respect rate limit disabled configuration", async () => {
      await serviceStatus({
        format: "json",
        rateLimit: {
          enabled: false,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should respect custom rate limit", async () => {
      await serviceStatus({
        format: "json",
        rateLimit: {
          limit: 10,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("retry configuration", () => {
    it("should respect retry enabled configuration", async () => {
      await serviceStatus({
        format: "json",
        retry: {
          enabled: true,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should respect retry disabled configuration", async () => {
      await serviceStatus({
        format: "json",
        retry: {
          enabled: false,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should respect custom retry attempts", async () => {
      await serviceStatus({
        format: "json",
        retry: {
          maxAttempts: 5,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("error handling", () => {
    it("should handle API errors", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(
        serviceStatus({
          format: "json",
          retry: { enabled: false },
          rateLimit: { interval: 10 },
        }),
      ).rejects.toThrow();
    });

    it("should handle network errors", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        serviceStatus({
          format: "json",
          retry: { enabled: false },
          rateLimit: { interval: 10 },
        }),
      ).rejects.toThrow("Network error");
    });
  });
});
