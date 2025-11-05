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

import { CacheManager } from "../../_shared/cacheManager";

const MOCK_ENDPOINT = "search";
const MOCK_PARAMS = new URLSearchParams({ q: "Paris", format: "json" });
const MOCK_VALUE = {
  place_id: 12345,
  display_name: "Paris, France",
  lat: "48.8566",
  lon: "2.3522",
};

describe("shared:cache-manager", () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    vi.clearAllMocks();
    cacheManager = new CacheManager();
  });

  describe("core functionality", () => {
    it("should initialize with default configuration", () => {
      const cache = new CacheManager();

      expect(cache.isEnabled()).toBe(true);
      expect(cache.getStats()).toStrictEqual({
        hits: 0,
        misses: 0,
        hitRate: 0,
        size: 0,
      });
    });

    it("should store and retrieve cached values", () => {
      cacheManager.set(MOCK_ENDPOINT, MOCK_PARAMS, MOCK_VALUE);

      const result = cacheManager.get(MOCK_ENDPOINT, MOCK_PARAMS);

      expect(result).toStrictEqual(MOCK_VALUE);
    });

    it("should return undefined for non-existent cache entries", () => {
      const nonExistentParams = new URLSearchParams({ q: "London" });
      const result = cacheManager.get(MOCK_ENDPOINT, nonExistentParams);

      expect(result).toBeUndefined();
    });

    it("should check if cache entry exists", () => {
      cacheManager.set(MOCK_ENDPOINT, MOCK_PARAMS, MOCK_VALUE);

      expect(cacheManager.has(MOCK_ENDPOINT, MOCK_PARAMS)).toBe(true);
      expect(
        cacheManager.has(MOCK_ENDPOINT, new URLSearchParams({ q: "Berlin" })),
      ).toBe(false);
    });

    it("should clear all cached entries and reset statistics", () => {
      cacheManager.set(MOCK_ENDPOINT, MOCK_PARAMS, MOCK_VALUE);
      cacheManager.get(MOCK_ENDPOINT, MOCK_PARAMS);

      cacheManager.clear();

      expect(cacheManager.has(MOCK_ENDPOINT, MOCK_PARAMS)).toBe(false);
      expect(cacheManager.getStats()).toStrictEqual({
        hits: 0,
        misses: 0,
        hitRate: 0,
        size: 0,
      });
    });
  });

  describe("cache configuration", () => {
    it("should respect enabled configuration", () => {
      const enabledCache = new CacheManager({ enabled: true });
      const disabledCache = new CacheManager({ enabled: false });

      expect(enabledCache.isEnabled()).toBe(true);
      expect(disabledCache.isEnabled()).toBe(false);
    });

    it("should respect custom maxSize configuration", () => {
      const cache = new CacheManager({ maxSize: 2 });

      cache.set(MOCK_ENDPOINT, new URLSearchParams({ q: "Paris" }), {
        id: 1,
      });
      cache.set(MOCK_ENDPOINT, new URLSearchParams({ q: "London" }), {
        id: 2,
      });
      cache.set(MOCK_ENDPOINT, new URLSearchParams({ q: "Berlin" }), {
        id: 3,
      });

      expect(cache.getStats().size).toBeLessThanOrEqual(2);
    });

    it("should respect custom ttl configuration", async () => {
      const cache = new CacheManager({ ttl: 50 });

      cache.set(MOCK_ENDPOINT, MOCK_PARAMS, MOCK_VALUE);
      expect(cache.has(MOCK_ENDPOINT, MOCK_PARAMS)).toBe(true);

      await new Promise((resolve) => {
        setTimeout(resolve, 75);
      });

      expect(cache.has(MOCK_ENDPOINT, MOCK_PARAMS)).toBe(false);
    });
  });

  describe("cache key generation", () => {
    it("should generate consistent keys for same parameters", () => {
      const params1 = new URLSearchParams({ q: "Paris", format: "json" });
      const params2 = new URLSearchParams({ q: "Paris", format: "json" });

      cacheManager.set(MOCK_ENDPOINT, params1, MOCK_VALUE);

      const result = cacheManager.get(MOCK_ENDPOINT, params2);

      expect(result).toStrictEqual(MOCK_VALUE);
    });

    it("should generate consistent keys regardless of parameter order", () => {
      const params1 = new URLSearchParams({
        q: "Paris",
        format: "json",
        limit: "10",
      });
      const params2 = new URLSearchParams({
        limit: "10",
        format: "json",
        q: "Paris",
      });

      cacheManager.set(MOCK_ENDPOINT, params1, MOCK_VALUE);

      const result = cacheManager.get(MOCK_ENDPOINT, params2);

      expect(result).toStrictEqual(MOCK_VALUE);
    });

    it("should generate different keys for different endpoints", () => {
      cacheManager.set("search", MOCK_PARAMS, MOCK_VALUE);

      const result = cacheManager.get("reverse", MOCK_PARAMS);

      expect(result).toBeUndefined();
    });

    it("should generate different keys for different parameters", () => {
      const params1 = new URLSearchParams({ q: "Paris" });
      const params2 = new URLSearchParams({ q: "London" });

      cacheManager.set(MOCK_ENDPOINT, params1, MOCK_VALUE);

      const result = cacheManager.get(MOCK_ENDPOINT, params2);

      expect(result).toBeUndefined();
    });
  });

  describe("cache statistics", () => {
    it("should track cache hits and misses", () => {
      cacheManager.set(MOCK_ENDPOINT, MOCK_PARAMS, MOCK_VALUE);

      cacheManager.get(MOCK_ENDPOINT, MOCK_PARAMS);
      cacheManager.get(MOCK_ENDPOINT, MOCK_PARAMS);
      cacheManager.get(MOCK_ENDPOINT, new URLSearchParams({ q: "London" }));

      const stats = cacheManager.getStats();

      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(0.67);
      expect(stats.size).toBe(1);
    });

    it("should return zero hit rate when no operations performed", () => {
      const stats = cacheManager.getStats();

      expect(stats.hitRate).toBe(0);
    });
  });

  describe("enabled/disabled behavior", () => {
    it("should not store or retrieve values when disabled", () => {
      const cache = new CacheManager({ enabled: false });

      cache.set(MOCK_ENDPOINT, MOCK_PARAMS, MOCK_VALUE);

      expect(cache.get(MOCK_ENDPOINT, MOCK_PARAMS)).toBeUndefined();
      expect(cache.has(MOCK_ENDPOINT, MOCK_PARAMS)).toBe(false);
    });

    it("should enable and disable caching dynamically", () => {
      cacheManager.set(MOCK_ENDPOINT, MOCK_PARAMS, MOCK_VALUE);

      cacheManager.setEnabled(false);

      expect(cacheManager.isEnabled()).toBe(false);
      expect(cacheManager.getStats().size).toBe(0);

      cacheManager.setEnabled(true);

      expect(cacheManager.isEnabled()).toBe(true);
    });
  });
});
