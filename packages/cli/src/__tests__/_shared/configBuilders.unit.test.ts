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

describe("configBuilders", () => {
  describe("common builder behavior", () => {
    const builders = [
      {
        name: "buildCacheConfig",
        fn: buildCacheConfig,
        disableFlag: "noCache",
        params: ["cacheTtl", "cacheMaxSize"],
        outputKeys: ["enabled", "ttl", "maxSize"],
      },
      {
        name: "buildRateLimitConfig",
        fn: buildRateLimitConfig,
        disableFlag: "noRateLimit",
        params: ["rateLimit", "rateLimitInterval"],
        outputKeys: ["enabled", "limit", "interval"],
      },
      {
        name: "buildRetryConfig",
        fn: buildRetryConfig,
        disableFlag: "noRetry",
        params: ["retryMaxAttempts", "retryInitialDelay"],
        outputKeys: ["enabled", "maxAttempts", "initialDelay"],
      },
    ];

    builders.forEach(({ name, fn, disableFlag, params }) => {
      describe(name, () => {
        it("should return undefined for empty input", () => {
          expect(fn({})).toBeUndefined();
        });

        it("should set enabled: false when disable flag is true", () => {
          expect(fn({ [disableFlag]: true })).toStrictEqual({ enabled: false });
        });

        it("should return empty object when disable flag is false", () => {
          expect(fn({ [disableFlag]: false })).toStrictEqual({});
        });

        it("should include provided numeric parameters", () => {
          const input = params.reduce(
            (acc, param, idx) => ({ ...acc, [param]: (idx + 1) * 100 }),
            {},
          );
          const result = fn(input);
          expect(result).toBeDefined();
          expect(Object.keys(result!).length).toBe(params.length);
        });

        it("should handle zero values", () => {
          const input = params.reduce(
            (acc, param) => ({ ...acc, [param]: 0 }),
            {},
          );
          const result = fn(input);
          expect(result).toBeDefined();
          Object.values(result!).forEach((value) => {
            expect(value).toBe(0);
          });
        });
      });
    });
  });

  describe("specific parameter mapping", () => {
    it("should map buildCacheConfig parameters correctly", () => {
      expect(buildCacheConfig({ cacheTtl: 5000 })).toStrictEqual({ ttl: 5000 });
      expect(buildCacheConfig({ cacheMaxSize: 100 })).toStrictEqual({
        maxSize: 100,
      });
      expect(
        buildCacheConfig({
          noCache: true,
          cacheTtl: 3000,
          cacheMaxSize: 50,
        }),
      ).toStrictEqual({
        enabled: false,
        ttl: 3000,
        maxSize: 50,
      });
    });

    it("should map buildRateLimitConfig parameters correctly", () => {
      expect(buildRateLimitConfig({ rateLimit: 10 })).toStrictEqual({
        limit: 10,
      });
      expect(buildRateLimitConfig({ rateLimitInterval: 1000 })).toStrictEqual({
        interval: 1000,
      });
      expect(
        buildRateLimitConfig({
          noRateLimit: true,
          rateLimit: 5,
          rateLimitInterval: 2000,
        }),
      ).toStrictEqual({
        enabled: false,
        limit: 5,
        interval: 2000,
      });
    });

    it("should map buildRetryConfig parameters correctly", () => {
      expect(buildRetryConfig({ retryMaxAttempts: 5 })).toStrictEqual({
        maxAttempts: 5,
      });
      expect(buildRetryConfig({ retryInitialDelay: 2000 })).toStrictEqual({
        initialDelay: 2000,
      });
      expect(
        buildRetryConfig({
          noRetry: true,
          retryMaxAttempts: 3,
          retryInitialDelay: 1500,
        }),
      ).toStrictEqual({
        enabled: false,
        maxAttempts: 3,
        initialDelay: 1500,
      });
    });
  });

  describe("integration scenarios", () => {
    it("should build complete configuration", () => {
      const argv = {
        cacheTtl: 3600000,
        cacheMaxSize: 100,
        rateLimit: 1,
        rateLimitInterval: 1000,
        retryMaxAttempts: 3,
        retryInitialDelay: 1000,
      };

      expect(buildCacheConfig(argv)).toStrictEqual({
        ttl: 3600000,
        maxSize: 100,
      });
      expect(buildRateLimitConfig(argv)).toStrictEqual({
        limit: 1,
        interval: 1000,
      });
      expect(buildRetryConfig(argv)).toStrictEqual({
        maxAttempts: 3,
        initialDelay: 1000,
      });
    });

    it("should handle all features disabled", () => {
      const argv = {
        noCache: true,
        noRateLimit: true,
        noRetry: true,
      };

      expect(buildCacheConfig(argv)).toStrictEqual({ enabled: false });
      expect(buildRateLimitConfig(argv)).toStrictEqual({ enabled: false });
      expect(buildRetryConfig(argv)).toStrictEqual({ enabled: false });
    });

    it("should handle minimal configuration", () => {
      expect(buildCacheConfig({})).toBeUndefined();
      expect(buildRateLimitConfig({})).toBeUndefined();
      expect(buildRetryConfig({})).toBeUndefined();
    });
  });
});
