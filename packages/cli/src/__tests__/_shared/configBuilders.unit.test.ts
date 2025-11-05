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

import { describe, expect, it } from "vitest";

import {
  buildCacheConfig,
  buildRateLimitConfig,
  buildRetryConfig,
} from "../../_shared/configBuilders";

describe("shared:config-builders", () => {
  describe("buildCacheConfig", () => {
    it("should return undefined when no cache parameters are provided", () => {
      const result = buildCacheConfig({});

      expect(result).toBeUndefined();
    });

    it("should disable cache when noCache is true", () => {
      const result = buildCacheConfig({ noCache: true });

      expect(result).toBeDefined();
      expect(result?.enabled).toBe(false);
    });

    it("should set TTL when cacheTtl is provided", () => {
      const result = buildCacheConfig({ cacheTtl: 60000 });

      expect(result).toBeDefined();
      expect(result?.ttl).toBe(60000);
    });

    it("should set maxSize when cacheMaxSize is provided", () => {
      const result = buildCacheConfig({ cacheMaxSize: 100 });

      expect(result).toBeDefined();
      expect(result?.maxSize).toBe(100);
    });

    it("should combine multiple cache parameters", () => {
      const result = buildCacheConfig({
        cacheTtl: 30000,
        cacheMaxSize: 200,
      });

      expect(result).toBeDefined();
      expect(result?.ttl).toBe(30000);
      expect(result?.maxSize).toBe(200);
    });

    it("should handle all cache parameters together", () => {
      const result = buildCacheConfig({
        noCache: false,
        cacheTtl: 45000,
        cacheMaxSize: 150,
      });

      expect(result).toBeDefined();
      expect(result?.enabled).toBeUndefined();
      expect(result?.ttl).toBe(45000);
      expect(result?.maxSize).toBe(150);
    });

    it("should only set enabled when noCache is true with other params", () => {
      const result = buildCacheConfig({
        noCache: true,
        cacheTtl: 60000,
        cacheMaxSize: 100,
      });

      expect(result).toBeDefined();
      expect(result?.enabled).toBe(false);
      expect(result?.ttl).toBe(60000);
      expect(result?.maxSize).toBe(100);
    });
  });

  describe("buildRateLimitConfig", () => {
    it("should return undefined when no rate limit parameters are provided", () => {
      const result = buildRateLimitConfig({});

      expect(result).toBeUndefined();
    });

    it("should disable rate limiting when noRateLimit is true", () => {
      const result = buildRateLimitConfig({ noRateLimit: true });

      expect(result).toBeDefined();
      expect(result?.enabled).toBe(false);
    });

    it("should set limit when rateLimit is provided", () => {
      const result = buildRateLimitConfig({ rateLimit: 10 });

      expect(result).toBeDefined();
      expect(result?.limit).toBe(10);
    });

    it("should set interval when rateLimitInterval is provided", () => {
      const result = buildRateLimitConfig({ rateLimitInterval: 2000 });

      expect(result).toBeDefined();
      expect(result?.interval).toBe(2000);
    });

    it("should combine multiple rate limit parameters", () => {
      const result = buildRateLimitConfig({
        rateLimit: 5,
        rateLimitInterval: 1500,
      });

      expect(result).toBeDefined();
      expect(result?.limit).toBe(5);
      expect(result?.interval).toBe(1500);
    });

    it("should handle all rate limit parameters together", () => {
      const result = buildRateLimitConfig({
        noRateLimit: false,
        rateLimit: 3,
        rateLimitInterval: 3000,
      });

      expect(result).toBeDefined();
      expect(result?.enabled).toBeUndefined();
      expect(result?.limit).toBe(3);
      expect(result?.interval).toBe(3000);
    });

    it("should disable rate limiting with other params", () => {
      const result = buildRateLimitConfig({
        noRateLimit: true,
        rateLimit: 10,
        rateLimitInterval: 1000,
      });

      expect(result).toBeDefined();
      expect(result?.enabled).toBe(false);
      expect(result?.limit).toBe(10);
      expect(result?.interval).toBe(1000);
    });

    it("should handle numeric rateLimit correctly", () => {
      const result = buildRateLimitConfig({ rateLimit: 0 });

      expect(result).toBeDefined();
      expect(result?.limit).toBe(0);
    });
  });

  describe("buildRetryConfig", () => {
    it("should return undefined when no retry parameters are provided", () => {
      const result = buildRetryConfig({});

      expect(result).toBeUndefined();
    });

    it("should disable retry when noRetry is true", () => {
      const result = buildRetryConfig({ noRetry: true });

      expect(result).toBeDefined();
      expect(result?.enabled).toBe(false);
    });

    it("should set maxAttempts when retryMaxAttempts is provided", () => {
      const result = buildRetryConfig({ retryMaxAttempts: 5 });

      expect(result).toBeDefined();
      expect(result?.maxAttempts).toBe(5);
    });

    it("should set initialDelay when retryInitialDelay is provided", () => {
      const result = buildRetryConfig({ retryInitialDelay: 2000 });

      expect(result).toBeDefined();
      expect(result?.initialDelay).toBe(2000);
    });

    it("should combine multiple retry parameters", () => {
      const result = buildRetryConfig({
        retryMaxAttempts: 3,
        retryInitialDelay: 1500,
      });

      expect(result).toBeDefined();
      expect(result?.maxAttempts).toBe(3);
      expect(result?.initialDelay).toBe(1500);
    });

    it("should handle all retry parameters together", () => {
      const result = buildRetryConfig({
        noRetry: false,
        retryMaxAttempts: 4,
        retryInitialDelay: 1000,
      });

      expect(result).toBeDefined();
      expect(result?.enabled).toBeUndefined();
      expect(result?.maxAttempts).toBe(4);
      expect(result?.initialDelay).toBe(1000);
    });

    it("should disable retry with other params", () => {
      const result = buildRetryConfig({
        noRetry: true,
        retryMaxAttempts: 2,
        retryInitialDelay: 500,
      });

      expect(result).toBeDefined();
      expect(result?.enabled).toBe(false);
      expect(result?.maxAttempts).toBe(2);
      expect(result?.initialDelay).toBe(500);
    });
  });
});
