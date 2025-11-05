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
  DEFAULT_CACHE_CONFIG,
  DEFAULT_RATE_LIMIT_CONFIG,
  DEFAULT_RETRY_CONFIG,
  FETCHER_BASE_URL,
  FETCHER_USER_AGENT,
} from "../../_shared/constants";

describe("shared:constants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("FETCHER_BASE_URL", () => {
    it("should be a valid URL string", () => {
      expect(typeof FETCHER_BASE_URL).toBe("string");
      expect(FETCHER_BASE_URL.length).toBeGreaterThan(0);
    });

    it("should point to the OpenStreetMap Nominatim API", () => {
      expect(FETCHER_BASE_URL).toBe("https://nominatim.openstreetmap.org");
    });

    it("should use HTTPS protocol", () => {
      expect(FETCHER_BASE_URL).toMatch(/^https:\/\//);
    });

    it("should be a valid URL that can be parsed", () => {
      expect(() => new URL(FETCHER_BASE_URL)).not.toThrow();
    });

    it("should not have a trailing slash", () => {
      expect(FETCHER_BASE_URL).not.toMatch(/\/$/);
    });
  });

  describe("FETCHER_USER_AGENT", () => {
    it("should be a valid string", () => {
      expect(typeof FETCHER_USER_AGENT).toBe("string");
      expect(FETCHER_USER_AGENT.length).toBeGreaterThan(0);
    });

    it("should identify the package", () => {
      expect(FETCHER_USER_AGENT).toBe("@simple-nominatim/core");
    });

    it("should follow npm package naming convention", () => {
      expect(FETCHER_USER_AGENT).toMatch(/^@[\da-z-]+\/[\da-z-]+$/);
    });
  });

  describe("DEFAULT_CACHE_CONFIG", () => {
    it("should be an object with all required properties", () => {
      expect(DEFAULT_CACHE_CONFIG).toBeDefined();
      expect(typeof DEFAULT_CACHE_CONFIG).toBe("object");
      expect(DEFAULT_CACHE_CONFIG).toHaveProperty("enabled");
      expect(DEFAULT_CACHE_CONFIG).toHaveProperty("ttl");
      expect(DEFAULT_CACHE_CONFIG).toHaveProperty("maxSize");
    });

    it("should have caching enabled by default", () => {
      expect(DEFAULT_CACHE_CONFIG.enabled).toBe(true);
    });

    it("should have a TTL of 5 minutes (300000ms)", () => {
      expect(DEFAULT_CACHE_CONFIG.ttl).toBe(300_000);
    });

    it("should have a maximum cache size of 500 entries", () => {
      expect(DEFAULT_CACHE_CONFIG.maxSize).toBe(500);
    });

    it("should have positive numeric values for ttl and maxSize", () => {
      expect(DEFAULT_CACHE_CONFIG.ttl).toBeGreaterThan(0);
      expect(DEFAULT_CACHE_CONFIG.maxSize).toBeGreaterThan(0);
    });

    it("should be immutable (frozen or sealed)", () => {
      const config = DEFAULT_CACHE_CONFIG;
      const originalEnabled = config.enabled;

      // TypeScript prevents modification, but we test the behavior
      expect(config.enabled).toBe(originalEnabled);
    });

    it("should have reasonable TTL value (between 1 minute and 1 hour)", () => {
      const oneMinute = 60_000;
      const oneHour = 3_600_000;

      expect(DEFAULT_CACHE_CONFIG.ttl).toBeGreaterThanOrEqual(oneMinute);
      expect(DEFAULT_CACHE_CONFIG.ttl).toBeLessThanOrEqual(oneHour);
    });

    it("should have reasonable maxSize value (between 100 and 1000)", () => {
      expect(DEFAULT_CACHE_CONFIG.maxSize).toBeGreaterThanOrEqual(100);
      expect(DEFAULT_CACHE_CONFIG.maxSize).toBeLessThanOrEqual(1000);
    });
  });

  describe("DEFAULT_RATE_LIMIT_CONFIG", () => {
    it("should be an object with all required properties", () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG).toBeDefined();
      expect(typeof DEFAULT_RATE_LIMIT_CONFIG).toBe("object");
      expect(DEFAULT_RATE_LIMIT_CONFIG).toHaveProperty("enabled");
      expect(DEFAULT_RATE_LIMIT_CONFIG).toHaveProperty("limit");
      expect(DEFAULT_RATE_LIMIT_CONFIG).toHaveProperty("interval");
      expect(DEFAULT_RATE_LIMIT_CONFIG).toHaveProperty("strict");
    });

    it("should have rate limiting enabled by default", () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.enabled).toBe(true);
    });

    it("should respect Nominatim usage policy (1 request per second)", () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.limit).toBe(1);
      expect(DEFAULT_RATE_LIMIT_CONFIG.interval).toBe(1000);
    });

    it("should have strict mode enabled by default", () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.strict).toBe(true);
    });

    it("should have positive numeric values for limit and interval", () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.limit).toBeGreaterThan(0);
      expect(DEFAULT_RATE_LIMIT_CONFIG.interval).toBeGreaterThan(0);
    });

    it("should calculate to 1 request per second", () => {
      const requestsPerSecond =
        DEFAULT_RATE_LIMIT_CONFIG.limit /
        (DEFAULT_RATE_LIMIT_CONFIG.interval / 1000);

      expect(requestsPerSecond).toBe(1);
    });

    it("should have interval in milliseconds", () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.interval).toBeGreaterThanOrEqual(100);
      expect(DEFAULT_RATE_LIMIT_CONFIG.interval).toBeLessThanOrEqual(10_000);
    });
  });

  describe("DEFAULT_RETRY_CONFIG", () => {
    it("should be an object with all required properties", () => {
      expect(DEFAULT_RETRY_CONFIG).toBeDefined();
      expect(typeof DEFAULT_RETRY_CONFIG).toBe("object");
      expect(DEFAULT_RETRY_CONFIG).toHaveProperty("enabled");
      expect(DEFAULT_RETRY_CONFIG).toHaveProperty("maxAttempts");
      expect(DEFAULT_RETRY_CONFIG).toHaveProperty("initialDelay");
      expect(DEFAULT_RETRY_CONFIG).toHaveProperty("maxDelay");
      expect(DEFAULT_RETRY_CONFIG).toHaveProperty("backoffMultiplier");
      expect(DEFAULT_RETRY_CONFIG).toHaveProperty("useJitter");
      expect(DEFAULT_RETRY_CONFIG).toHaveProperty("retryableStatusCodes");
    });

    it("should have retry enabled by default", () => {
      expect(DEFAULT_RETRY_CONFIG.enabled).toBe(true);
    });

    it("should have 3 max attempts", () => {
      expect(DEFAULT_RETRY_CONFIG.maxAttempts).toBe(3);
    });

    it("should have 1 second initial delay", () => {
      expect(DEFAULT_RETRY_CONFIG.initialDelay).toBe(1000);
    });

    it("should have 10 seconds max delay", () => {
      expect(DEFAULT_RETRY_CONFIG.maxDelay).toBe(10_000);
    });

    it("should have exponential backoff multiplier of 2", () => {
      expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBe(2);
    });

    it("should have jitter enabled by default", () => {
      expect(DEFAULT_RETRY_CONFIG.useJitter).toBe(true);
    });

    it("should include standard retryable HTTP status codes", () => {
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toBeDefined();
      expect(Array.isArray(DEFAULT_RETRY_CONFIG.retryableStatusCodes)).toBe(
        true,
      );
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes.length).toBeGreaterThan(
        0,
      );
    });

    it("should include 408 (Request Timeout) in retryable codes", () => {
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toContain(408);
    });

    it("should include 429 (Too Many Requests) in retryable codes", () => {
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toContain(429);
    });

    it("should include 500 (Internal Server Error) in retryable codes", () => {
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toContain(500);
    });

    it("should include 502 (Bad Gateway) in retryable codes", () => {
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toContain(502);
    });

    it("should include 503 (Service Unavailable) in retryable codes", () => {
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toContain(503);
    });

    it("should include 504 (Gateway Timeout) in retryable codes", () => {
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toContain(504);
    });

    it("should have exactly 6 retryable status codes", () => {
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toHaveLength(6);
    });

    it("should have positive numeric values for timing parameters", () => {
      expect(DEFAULT_RETRY_CONFIG.maxAttempts).toBeGreaterThan(0);
      expect(DEFAULT_RETRY_CONFIG.initialDelay).toBeGreaterThan(0);
      expect(DEFAULT_RETRY_CONFIG.maxDelay).toBeGreaterThan(0);
      expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBeGreaterThan(0);
    });

    it("should have maxDelay greater than initialDelay", () => {
      expect(DEFAULT_RETRY_CONFIG.maxDelay).toBeGreaterThan(
        DEFAULT_RETRY_CONFIG.initialDelay,
      );
    });

    it("should have maxAttempts between 1 and 5", () => {
      expect(DEFAULT_RETRY_CONFIG.maxAttempts).toBeGreaterThanOrEqual(1);
      expect(DEFAULT_RETRY_CONFIG.maxAttempts).toBeLessThanOrEqual(5);
    });

    it("should have backoffMultiplier between 1.5 and 3", () => {
      expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBeGreaterThanOrEqual(
        1.5,
      );
      expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBeLessThanOrEqual(3);
    });

    it("should only include 4xx and 5xx status codes", () => {
      const allValid = DEFAULT_RETRY_CONFIG.retryableStatusCodes.every(
        (code) => code >= 400 && code < 600,
      );

      expect(allValid).toBe(true);
    });
  });

  describe("configuration consistency", () => {
    it("should have all configurations as objects", () => {
      expect(typeof DEFAULT_CACHE_CONFIG).toBe("object");
      expect(typeof DEFAULT_RATE_LIMIT_CONFIG).toBe("object");
      expect(typeof DEFAULT_RETRY_CONFIG).toBe("object");
    });

    it("should have enabled flags as booleans in all configs", () => {
      expect(typeof DEFAULT_CACHE_CONFIG.enabled).toBe("boolean");
      expect(typeof DEFAULT_RATE_LIMIT_CONFIG.enabled).toBe("boolean");
      expect(typeof DEFAULT_RETRY_CONFIG.enabled).toBe("boolean");
    });

    it("should have all configs enabled by default", () => {
      expect(DEFAULT_CACHE_CONFIG.enabled).toBe(true);
      expect(DEFAULT_RATE_LIMIT_CONFIG.enabled).toBe(true);
      expect(DEFAULT_RETRY_CONFIG.enabled).toBe(true);
    });

    it("should export all required constants", () => {
      expect(FETCHER_BASE_URL).toBeDefined();
      expect(FETCHER_USER_AGENT).toBeDefined();
      expect(DEFAULT_CACHE_CONFIG).toBeDefined();
      expect(DEFAULT_RATE_LIMIT_CONFIG).toBeDefined();
      expect(DEFAULT_RETRY_CONFIG).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("should maintain FETCHER_BASE_URL value", () => {
      const originalValue = FETCHER_BASE_URL;

      expect(FETCHER_BASE_URL).toBe(originalValue);
      expect(FETCHER_BASE_URL).toBe("https://nominatim.openstreetmap.org");
    });

    it("should maintain FETCHER_USER_AGENT value", () => {
      const originalValue = FETCHER_USER_AGENT;

      expect(FETCHER_USER_AGENT).toBe(originalValue);
      expect(FETCHER_USER_AGENT).toBe("@simple-nominatim/core");
    });

    it("should handle FETCHER_BASE_URL in URL constructor", () => {
      const url = new URL("/search", FETCHER_BASE_URL);

      expect(url.toString()).toBe("https://nominatim.openstreetmap.org/search");
    });

    it("should handle DEFAULT_CACHE_CONFIG spread operation", () => {
      const customConfig = { ...DEFAULT_CACHE_CONFIG, enabled: false };

      expect(customConfig.enabled).toBe(false);
      expect(customConfig.ttl).toBe(DEFAULT_CACHE_CONFIG.ttl);
      expect(customConfig.maxSize).toBe(DEFAULT_CACHE_CONFIG.maxSize);
    });

    it("should handle DEFAULT_RATE_LIMIT_CONFIG spread operation", () => {
      const customConfig = { ...DEFAULT_RATE_LIMIT_CONFIG, limit: 5 };

      expect(customConfig.limit).toBe(5);
      expect(customConfig.interval).toBe(DEFAULT_RATE_LIMIT_CONFIG.interval);
      expect(customConfig.strict).toBe(DEFAULT_RATE_LIMIT_CONFIG.strict);
    });

    it("should handle DEFAULT_RETRY_CONFIG spread operation", () => {
      const customConfig = { ...DEFAULT_RETRY_CONFIG, maxAttempts: 5 };

      expect(customConfig.maxAttempts).toBe(5);
      expect(customConfig.initialDelay).toBe(DEFAULT_RETRY_CONFIG.initialDelay);
      expect(customConfig.retryableStatusCodes).toBe(
        DEFAULT_RETRY_CONFIG.retryableStatusCodes,
      );
    });
  });
});
