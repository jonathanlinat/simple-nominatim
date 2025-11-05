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

import {
  dataFetcher,
  resetDataFetcherInstances,
} from "../../_shared/dataFetcher";

const MOCK_ENDPOINT = "search";
const MOCK_PARAMS = new URLSearchParams({ q: "Paris", format: "json" });
const MOCK_RESPONSE = {
  place_id: 12345,
  display_name: "Paris, France",
  lat: "48.8566",
  lon: "2.3522",
};

describe("shared:data-fetcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetDataFetcherInstances();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => MOCK_RESPONSE,
      text: async () => "OK",
    });
  });

  describe("core functionality", () => {
    it("should fetch data successfully", async () => {
      const result = await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS);

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should construct correct URL with endpoint and params", async () => {
      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS);

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];

      expect(fetchCall).toBeDefined();
      expect(fetchCall![0]).toContain("nominatim.openstreetmap.org");
      expect(fetchCall![0]).toContain("/search?");
      expect(fetchCall![0]).toContain("q=Paris");
      expect(fetchCall![0]).toContain("format=json");
    });

    it("should include User-Agent header", async () => {
      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS);

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      const headers = (fetchCall![1] as RequestInit)?.headers as Record<
        string,
        string
      >;

      expect(headers).toBeDefined();
      expect(headers["User-Agent"]).toBe("@simple-nominatim/core");
    });

    it("should parse JSON response by default", async () => {
      const result = await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS);

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(typeof result).toBe("object");
    });

    it("should parse text response for non-JSON formats", async () => {
      const textParams = new URLSearchParams({ q: "Paris", format: "xml" });

      const result = await dataFetcher(MOCK_ENDPOINT, textParams);

      expect(result).toBe("OK");
      expect(typeof result).toBe("string");
    });
  });

  describe("singleton cache behavior", () => {
    it("should use singleton cache across multiple calls", async () => {
      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        cache: { enabled: true },
      });

      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        cache: { enabled: true },
      });

      // Singleton cache persists, so second call uses cached response
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should reset cache when instances are reset", async () => {
      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        cache: { enabled: true },
      });

      resetDataFetcherInstances();

      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        cache: { enabled: true },
      });

      // After reset, cache is cleared so fetch is called twice
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should bypass cache when disabled", async () => {
      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        cache: { enabled: false },
        rateLimit: { interval: 10 },
      });

      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        cache: { enabled: false },
        rateLimit: { interval: 10 },
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should cache different requests separately", async () => {
      const params1 = new URLSearchParams({ q: "Paris", format: "json" });
      const params2 = new URLSearchParams({ q: "London", format: "json" });

      await dataFetcher(MOCK_ENDPOINT, params1, {
        cache: { enabled: true },
        rateLimit: { interval: 10 },
      });
      await dataFetcher(MOCK_ENDPOINT, params2, {
        cache: { enabled: true },
        rateLimit: { interval: 10 },
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("singleton rate limiter behavior", () => {
    it("should respect rate limit when enabled", async () => {
      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        rateLimit: { enabled: true },
        cache: { enabled: false },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should bypass rate limit when disabled", async () => {
      await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        rateLimit: { enabled: false },
        cache: { enabled: false },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("retry logic", () => {
    it("should retry on network error", async () => {
      let callCount = 0;

      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++;

        if (callCount === 1) {
          throw new Error("Network error");
        }

        return {
          ok: true,
          status: 200,
          json: async () => MOCK_RESPONSE,
        };
      });

      const result = await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        retry: { enabled: true, maxAttempts: 2, initialDelay: 1 },
        cache: { enabled: false },
        rateLimit: { interval: 1 },
      });

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should retry on retryable HTTP status codes", async () => {
      let callCount = 0;

      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++;

        if (callCount === 1) {
          return {
            ok: false,
            status: 503,
            statusText: "Service Unavailable",
          };
        }

        return {
          ok: true,
          status: 200,
          json: async () => MOCK_RESPONSE,
        };
      });

      const result = await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        retry: { enabled: true, maxAttempts: 2, initialDelay: 1 },
        cache: { enabled: false },
        rateLimit: { interval: 1 },
      });

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should not retry when disabled", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
          retry: { enabled: false },
          cache: { enabled: false },
        }),
      ).rejects.toThrow("Network error");

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should respect maxAttempts configuration", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
          retry: { enabled: true, maxAttempts: 3, initialDelay: 1 },
          cache: { enabled: false },
          rateLimit: { interval: 1 },
        }),
      ).rejects.toThrow("Network error");

      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("should use exponential backoff delay", async () => {
      let callCount = 0;

      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++;

        if (callCount < 3) {
          throw new Error("Network error");
        }

        return {
          ok: true,
          status: 200,
          json: async () => MOCK_RESPONSE,
        };
      });

      const result = await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        retry: {
          enabled: true,
          maxAttempts: 3,
          initialDelay: 1,
          backoffMultiplier: 2,
          useJitter: false,
        },
        cache: { enabled: false },
        rateLimit: { interval: 1 },
      });

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("should not retry on non-retryable status codes", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(
        dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
          retry: { enabled: false },
          cache: { enabled: false },
        }),
      ).rejects.toThrow("HTTP error");

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("error handling", () => {
    it("should throw error on HTTP error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      await expect(
        dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
          retry: { enabled: false },
          cache: { enabled: false },
        }),
      ).rejects.toThrow("HTTP error! Status: 400");
    });

    it("should throw error on network failure", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network failure"));

      await expect(
        dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
          retry: { enabled: false },
          cache: { enabled: false },
        }),
      ).rejects.toThrow("Network failure");
    });

    it("should throw error after all retry attempts exhausted", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Persistent error"));

      await expect(
        dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
          retry: { enabled: true, maxAttempts: 3, initialDelay: 1 },
          cache: { enabled: false },
          rateLimit: { interval: 1 },
        }),
      ).rejects.toThrow("Persistent error");

      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe("configuration", () => {
    it("should work with all features enabled", async () => {
      const result = await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        cache: { enabled: true },
        rateLimit: { enabled: true },
        retry: { enabled: true },
      });

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should work with all features disabled", async () => {
      const result = await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS, {
        cache: { enabled: false },
        rateLimit: { enabled: false },
        retry: { enabled: false },
      });

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should work with no options provided", async () => {
      const result = await dataFetcher(MOCK_ENDPOINT, MOCK_PARAMS);

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
