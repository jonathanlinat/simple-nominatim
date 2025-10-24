/**
 * MIT License
 *
 * Copyright (c) 2023-2025 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software:"), to deal
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

import { describe, expect, it } from "vitest";

import {
  DEFAULT_CACHE_CONFIG,
  DEFAULT_RATE_LIMIT_CONFIG,
  DEFAULT_RETRY_CONFIG,
  FETCHER_BASE_URL,
  FETCHER_USER_AGENT,
} from "../../_shared/constants";

describe("Constants", () => {
  describe("FETCHER_BASE_URL", () => {
    it("should be a valid OSM Nominatim URL", () => {
      expect(FETCHER_BASE_URL).toBe("https://nominatim.openstreetmap.org");
      expect(() => new URL(FETCHER_BASE_URL)).not.toThrow();
    });
  });

  describe("FETCHER_USER_AGENT", () => {
    it("should identify as @simple-nominatim/core", () => {
      expect(FETCHER_USER_AGENT).toBe("@simple-nominatim/core");
      expect(FETCHER_USER_AGENT).toBeTruthy();
      expect(FETCHER_USER_AGENT.length).toBeGreaterThan(0);
    });
  });

  describe("DEFAULT_CACHE_CONFIG", () => {
    it("should have correct default cache configuration", () => {
      expect(DEFAULT_CACHE_CONFIG.enabled).toBe(true);
      expect(DEFAULT_CACHE_CONFIG.ttl).toBe(300000);
      expect(DEFAULT_CACHE_CONFIG.maxSize).toBe(500);
    });
  });

  describe("DEFAULT_RATE_LIMIT_CONFIG", () => {
    it("should have correct default rate limit configuration", () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.enabled).toBe(true);
      expect(DEFAULT_RATE_LIMIT_CONFIG.limit).toBe(1);
      expect(DEFAULT_RATE_LIMIT_CONFIG.interval).toBe(1000);
      expect(DEFAULT_RATE_LIMIT_CONFIG.strict).toBe(true);
    });
  });

  describe("DEFAULT_RETRY_CONFIG", () => {
    it("should have correct default retry configuration", () => {
      expect(DEFAULT_RETRY_CONFIG.enabled).toBe(true);
      expect(DEFAULT_RETRY_CONFIG.maxAttempts).toBe(3);
      expect(DEFAULT_RETRY_CONFIG.initialDelay).toBe(1000);
      expect(DEFAULT_RETRY_CONFIG.maxDelay).toBe(10000);
      expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBe(2);
      expect(DEFAULT_RETRY_CONFIG.useJitter).toBe(true);
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toEqual([
        408, 429, 500, 502, 503, 504,
      ]);
    });
  });
});
