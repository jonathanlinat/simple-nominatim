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

import { RateLimiter } from "../../_shared/rateLimiter";

describe("shared:rate-limiter", () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    vi.clearAllMocks();
    rateLimiter = new RateLimiter({ interval: 10 });
  });

  describe("core functionality", () => {
    it("should initialize with default configuration", () => {
      const limiter = new RateLimiter();

      expect(limiter.isEnabled()).toBe(true);
      expect(limiter.getStats()).toStrictEqual({
        requestCount: 0,
        queuedCount: 0,
      });
    });

    it("should execute function and return result", async () => {
      const mockFn = vi.fn().mockResolvedValue("result");

      const result = await rateLimiter.execute(mockFn);

      expect(result).toBe("result");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should track request count after execution", async () => {
      const mockFn = vi.fn().mockResolvedValue("result");

      await rateLimiter.execute(mockFn);

      const stats = rateLimiter.getStats();

      expect(stats.requestCount).toBe(1);
      expect(stats.queuedCount).toBe(0);
    });

    it("should execute multiple functions sequentially", async () => {
      const mockFn1 = vi.fn().mockResolvedValue("result1");
      const mockFn2 = vi.fn().mockResolvedValue("result2");
      const mockFn3 = vi.fn().mockResolvedValue("result3");

      const result1 = await rateLimiter.execute(mockFn1);
      const result2 = await rateLimiter.execute(mockFn2);
      const result3 = await rateLimiter.execute(mockFn3);

      expect(result1).toBe("result1");
      expect(result2).toBe("result2");
      expect(result3).toBe("result3");
      expect(rateLimiter.getStats().requestCount).toBe(3);
    });
  });

  describe("rate limiting behavior", () => {
    it("should throttle requests based on configured limit", async () => {
      const limiter = new RateLimiter({ limit: 2, interval: 10 });
      const mockFn = vi.fn().mockResolvedValue("result");

      const startTime = Date.now();

      await Promise.all([
        limiter.execute(mockFn),
        limiter.execute(mockFn),
        limiter.execute(mockFn),
      ]);

      const duration = Date.now() - startTime;

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(duration).toBeGreaterThanOrEqual(10);
    });

    it("should respect custom interval configuration", async () => {
      const limiter = new RateLimiter({ limit: 1, interval: 10 });
      const mockFn = vi.fn().mockResolvedValue("result");

      const startTime = Date.now();

      await limiter.execute(mockFn);
      await limiter.execute(mockFn);

      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(10);
    });

    it("should bypass rate limiting when disabled", async () => {
      const limiter = new RateLimiter({ enabled: false });
      const mockFn = vi.fn().mockResolvedValue("result");

      const startTime = Date.now();

      await Promise.all([
        limiter.execute(mockFn),
        limiter.execute(mockFn),
        limiter.execute(mockFn),
      ]);

      const duration = Date.now() - startTime;

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(duration).toBeLessThan(100);
    });
  });

  describe("statistics tracking", () => {
    it("should track request count correctly", async () => {
      const mockFn = vi.fn().mockResolvedValue("result");

      await rateLimiter.execute(mockFn);
      await rateLimiter.execute(mockFn);
      await rateLimiter.execute(mockFn);

      const stats = rateLimiter.getStats();

      expect(stats.requestCount).toBe(3);
    });

    it("should reset statistics", async () => {
      const mockFn = vi.fn().mockResolvedValue("result");

      await rateLimiter.execute(mockFn);
      await rateLimiter.execute(mockFn);

      rateLimiter.resetStats();

      const stats = rateLimiter.getStats();

      expect(stats.requestCount).toBe(0);
      expect(stats.queuedCount).toBe(0);
    });

    it("should not increment request count when disabled", async () => {
      const limiter = new RateLimiter({ enabled: false });
      const mockFn = vi.fn().mockResolvedValue("result");

      await limiter.execute(mockFn);
      await limiter.execute(mockFn);

      const stats = limiter.getStats();

      expect(stats.requestCount).toBe(0);
    });
  });

  describe("enable/disable behavior", () => {
    it("should check if rate limiting is enabled", () => {
      const enabledLimiter = new RateLimiter({ enabled: true });
      const disabledLimiter = new RateLimiter({ enabled: false });

      expect(enabledLimiter.isEnabled()).toBe(true);
      expect(disabledLimiter.isEnabled()).toBe(false);
    });

    it("should toggle rate limiting enabled state", () => {
      rateLimiter.setEnabled(false);
      expect(rateLimiter.isEnabled()).toBe(false);

      rateLimiter.setEnabled(true);
      expect(rateLimiter.isEnabled()).toBe(true);
    });

    it("should reset stats when disabling rate limiting", async () => {
      const mockFn = vi.fn().mockResolvedValue("result");

      await rateLimiter.execute(mockFn);
      await rateLimiter.execute(mockFn);

      expect(rateLimiter.getStats().requestCount).toBe(2);

      rateLimiter.setEnabled(false);

      const stats = rateLimiter.getStats();

      expect(stats.requestCount).toBe(0);
      expect(stats.queuedCount).toBe(0);
    });
  });

  describe("error handling", () => {
    it("should propagate errors from executed function", async () => {
      const error = new Error("Test error");
      const mockFn = vi.fn().mockRejectedValue(error);

      await expect(rateLimiter.execute(mockFn)).rejects.toThrow("Test error");
    });

    it("should not increment request count when function throws error", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("Test error"));

      await expect(rateLimiter.execute(mockFn)).rejects.toThrow();

      const stats = rateLimiter.getStats();

      expect(stats.requestCount).toBe(0);
    });

    it("should handle multiple errors without incrementing count", async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error("Test error"));

      await expect(rateLimiter.execute(mockFn)).rejects.toThrow();
      await expect(rateLimiter.execute(mockFn)).rejects.toThrow();

      const stats = rateLimiter.getStats();

      expect(stats.requestCount).toBe(0);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe("configuration options", () => {
    it("should respect custom limit configuration", async () => {
      const limiter = new RateLimiter({ limit: 3, interval: 10 });
      const mockFn = vi.fn().mockResolvedValue("result");

      const startTime = Date.now();

      await Promise.all([
        limiter.execute(mockFn),
        limiter.execute(mockFn),
        limiter.execute(mockFn),
        limiter.execute(mockFn),
      ]);

      const duration = Date.now() - startTime;

      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(duration).toBeGreaterThanOrEqual(10);
    });

    it("should handle strict mode configuration", async () => {
      const strictLimiter = new RateLimiter({
        limit: 1,
        interval: 10,
        strict: true,
      });
      const mockFn = vi.fn().mockResolvedValue("result");

      const startTime = Date.now();

      await strictLimiter.execute(mockFn);
      await strictLimiter.execute(mockFn);

      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(10);
    });

    it("should use default configuration when no config provided", () => {
      const limiter = new RateLimiter();

      expect(limiter.isEnabled()).toBe(true);
      expect(limiter.getStats()).toStrictEqual({
        requestCount: 0,
        queuedCount: 0,
      });
    });
  });
});
