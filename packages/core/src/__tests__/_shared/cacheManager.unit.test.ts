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

import { beforeEach, describe, expect, it } from "vitest";

import { CacheManager } from "../../_shared/cacheManager";

describe("CacheManager", () => {
  let cache: CacheManager<{ data: string }>;
  const endpoint = "/search";
  const params = new URLSearchParams({ q: "Paris", format: "json" });
  const testData = { data: "test result" };

  beforeEach(() => {
    cache = new CacheManager();
  });

  describe("constructor()", () => {
    it("should create cache with default config", () => {
      expect(cache.isEnabled()).toBe(true);
      expect(cache.getStats().size).toBe(0);
    });

    it("should create cache with custom config", () => {
      const customCache = new CacheManager({
        enabled: false,
        maxSize: 100,
        ttl: 60000,
      });

      expect(customCache.isEnabled()).toBe(false);
    });

    it("should create enabled cache when enabled is true", () => {
      const enabledCache = new CacheManager({ enabled: true });

      expect(enabledCache.isEnabled()).toBe(true);
    });

    it("should create disabled cache when enabled is false", () => {
      const disabledCache = new CacheManager({ enabled: false });

      expect(disabledCache.isEnabled()).toBe(false);
    });
  });

  describe("get() and set()", () => {
    it("should return undefined when cache is empty", () => {
      expect(cache.get(endpoint, params)).toBeUndefined();
    });

    it("should store and retrieve cached values", () => {
      cache.set(endpoint, params, testData);
      expect(cache.get(endpoint, params)).toEqual(testData);
    });

    it("should return undefined when caching is disabled", () => {
      cache.setEnabled(false);
      cache.set(endpoint, params, testData);
      expect(cache.get(endpoint, params)).toBeUndefined();
    });

    it("should not store values when caching is disabled", () => {
      cache.setEnabled(false);
      cache.set(endpoint, params, testData);
      expect(cache.getStats().size).toBe(0);
    });

    it("should handle different endpoints separately", () => {
      const endpoint1 = "/search";
      const endpoint2 = "/reverse";
      const data1 = { data: "search result" };
      const data2 = { data: "reverse result" };

      cache.set(endpoint1, params, data1);
      cache.set(endpoint2, params, data2);

      expect(cache.get(endpoint1, params)).toEqual(data1);
      expect(cache.get(endpoint2, params)).toEqual(data2);
    });

    it("should handle different params separately", () => {
      const params1 = new URLSearchParams({ q: "Paris" });
      const params2 = new URLSearchParams({ q: "London" });
      const data1 = { data: "Paris result" };
      const data2 = { data: "London result" };

      cache.set(endpoint, params1, data1);
      cache.set(endpoint, params2, data2);

      expect(cache.get(endpoint, params1)).toEqual(data1);
      expect(cache.get(endpoint, params2)).toEqual(data2);
    });

    it("should generate same key for params in different order", () => {
      const params1 = new URLSearchParams({ q: "Paris", format: "json" });
      const params2 = new URLSearchParams({ format: "json", q: "Paris" });

      cache.set(endpoint, params1, testData);
      expect(cache.get(endpoint, params2)).toEqual(testData);
    });
  });

  describe("has()", () => {
    it("should return false when cache is empty", () => {
      expect(cache.has(endpoint, params)).toBe(false);
    });

    it("should return true when value exists", () => {
      cache.set(endpoint, params, testData);
      expect(cache.has(endpoint, params)).toBe(true);
    });

    it("should return false when caching is disabled", () => {
      cache.set(endpoint, params, testData);
      cache.setEnabled(false);
      expect(cache.has(endpoint, params)).toBe(false);
    });

    it("should return false for different params", () => {
      const otherParams = new URLSearchParams({ q: "London" });
      cache.set(endpoint, params, testData);
      expect(cache.has(endpoint, otherParams)).toBe(false);
    });
  });

  describe("clear()", () => {
    it("should clear all cached entries", () => {
      cache.set(endpoint, params, testData);
      cache.clear();
      expect(cache.get(endpoint, params)).toBeUndefined();
      expect(cache.getStats().size).toBe(0);
    });

    it("should reset stats", () => {
      cache.set(endpoint, params, testData);
      cache.get(endpoint, params);
      cache.get(endpoint, new URLSearchParams({ q: "unknown" }));

      expect(cache.getStats().hits).toBeGreaterThan(0);
      expect(cache.getStats().misses).toBeGreaterThan(0);

      cache.clear();
      const stats = cache.getStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe("getStats()", () => {
    it("should return initial stats", () => {
      const stats = cache.getStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(0);
      expect(stats.size).toBe(0);
    });

    it("should track cache hits", () => {
      cache.set(endpoint, params, testData);
      cache.get(endpoint, params);
      cache.get(endpoint, params);

      const stats = cache.getStats();

      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(1);
    });

    it("should track cache misses", () => {
      cache.get(endpoint, params);
      cache.get(endpoint, params);

      const stats = cache.getStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBe(0);
    });

    it("should calculate hit rate correctly", () => {
      cache.set(endpoint, params, testData);
      cache.get(endpoint, params);
      cache.get(endpoint, new URLSearchParams({ q: "unknown" }));
      cache.get(endpoint, new URLSearchParams({ q: "another" }));

      const stats = cache.getStats();

      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBe(0.33);
    });

    it("should track cache size", () => {
      cache.set(endpoint, params, testData);
      cache.set(endpoint, new URLSearchParams({ q: "London" }), testData);

      expect(cache.getStats().size).toBe(2);
    });
  });

  describe("isEnabled() and setEnabled()", () => {
    it("should return enabled state", () => {
      expect(cache.isEnabled()).toBe(true);

      cache.setEnabled(false);
      expect(cache.isEnabled()).toBe(false);

      cache.setEnabled(true);
      expect(cache.isEnabled()).toBe(true);
    });

    it("should clear cache when disabling", () => {
      cache.set(endpoint, params, testData);
      expect(cache.getStats().size).toBe(1);

      cache.setEnabled(false);
      expect(cache.getStats().size).toBe(0);
    });

    it("should not affect stats when enabling", () => {
      cache.set(endpoint, params, testData);
      cache.get(endpoint, params);

      cache.setEnabled(false);
      cache.setEnabled(true);

      expect(cache.getStats().hits).toBe(0);
      expect(cache.getStats().misses).toBe(0);
    });
  });

  describe("TTL behavior", () => {
    it("should respect TTL configuration", () => {
      const shortTtlCache = new CacheManager({ ttl: 1000 });
      shortTtlCache.set(endpoint, params, testData);

      expect(shortTtlCache.get(endpoint, params)).toEqual(testData);
    });

    it("should create cache with custom TTL", () => {
      const customTtlCache = new CacheManager({ ttl: 5000 });
      customTtlCache.set(endpoint, params, testData);

      expect(customTtlCache.get(endpoint, params)).toEqual(testData);
    });
  });

  describe("max size behavior", () => {
    it("should respect max size limit", () => {
      const smallCache = new CacheManager<{ data: string }>({ maxSize: 2 });

      smallCache.set(endpoint, new URLSearchParams({ q: "1" }), { data: "1" });
      smallCache.set(endpoint, new URLSearchParams({ q: "2" }), { data: "2" });
      smallCache.set(endpoint, new URLSearchParams({ q: "3" }), { data: "3" });

      expect(smallCache.getStats().size).toBeLessThanOrEqual(2);
    });
  });
});
