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

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RateLimiter } from "../../_shared/rateLimiter";

describe("RateLimiter", () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    vi.useFakeTimers();
    limiter = new RateLimiter();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("constructor()", () => {
    it("should create with default configuration", () => {
      const defaultLimiter = new RateLimiter();

      expect(defaultLimiter.isEnabled()).toBe(true);
      expect(defaultLimiter.getStats()).toEqual({
        requestCount: 0,
        queuedCount: 0,
      });
    });

    it("should create with custom configuration", () => {
      const customLimiter = new RateLimiter({
        enabled: false,
        limit: 5,
        interval: 2000,
        strict: false,
      });

      expect(customLimiter.isEnabled()).toBe(false);
      expect(customLimiter.getStats()).toEqual({
        requestCount: 0,
        queuedCount: 0,
      });
    });

    it("should respect enabled option", () => {
      const disabledLimiter = new RateLimiter({ enabled: false });

      expect(disabledLimiter.isEnabled()).toBe(false);
    });

    it("should use default values for omitted options", () => {
      const partialLimiter = new RateLimiter({ limit: 10 });

      expect(partialLimiter.isEnabled()).toBe(true);
    });
  });

  describe("execute()", () => {
    it("should execute a function successfully", async () => {
      const fn = async () => "test result";

      const result = await limiter.execute(fn);

      expect(result).toBe("test result");
    });

    it("should execute function returning object", async () => {
      const fn = async () => ({ data: "test", status: "ok" });

      const result = await limiter.execute(fn);

      expect(result).toEqual({ data: "test", status: "ok" });
    });

    it("should increment request count after execution", async () => {
      const fn = async () => "result";

      await limiter.execute(fn);

      expect(limiter.getStats().requestCount).toBe(1);
    });

    it("should increment queued count during execution", async () => {
      const fn = async () => {
        const stats = limiter.getStats();
        expect(stats.queuedCount).toBeGreaterThan(0);

        return "result";
      };

      await limiter.execute(fn);
    });

    it("should decrement queued count after execution", async () => {
      const fn = async () => "result";

      await limiter.execute(fn);

      expect(limiter.getStats().queuedCount).toBe(0);
    });

    it("should execute multiple functions sequentially", async () => {
      const results: string[] = [];
      const fn1 = async () => {
        results.push("first");

        return "first";
      };
      const fn2 = async () => {
        results.push("second");

        return "second";
      };

      const promise = Promise.all([limiter.execute(fn1), limiter.execute(fn2)]);
      await vi.advanceTimersByTimeAsync(1000);
      await promise;

      expect(results).toHaveLength(2);
      expect(limiter.getStats().requestCount).toBe(2);
    });

    it("should bypass rate limiting when disabled", async () => {
      limiter.setEnabled(false);
      const fn = async () => "result";

      const result = await limiter.execute(fn);

      expect(result).toBe("result");
      expect(limiter.getStats().requestCount).toBe(0);
    });

    it("should handle errors in executed function", async () => {
      const fn = async () => {
        throw new Error("Test error");
      };

      await expect(limiter.execute(fn)).rejects.toThrow("Test error");
    });

    it("should decrement queued count even on error", async () => {
      const fn = async () => {
        throw new Error("Test error");
      };

      try {
        await limiter.execute(fn);
      } catch {
        // Expected error
      }

      expect(limiter.getStats().queuedCount).toBe(0);
    });
  });

  describe("getStats()", () => {
    it("should return initial stats with zeros", () => {
      const stats = limiter.getStats();

      expect(stats).toEqual({
        requestCount: 0,
        queuedCount: 0,
      });
    });

    it("should track request count", async () => {
      const fn = async () => "result";

      const promise1 = limiter.execute(fn);
      await vi.advanceTimersByTimeAsync(500);
      const promise2 = limiter.execute(fn);
      await vi.advanceTimersByTimeAsync(500);
      await promise1;
      await promise2;

      const stats = limiter.getStats();
      expect(stats.requestCount).toBe(2);
    });

    it("should return current stats snapshot", () => {
      const stats1 = limiter.getStats();
      const stats2 = limiter.getStats();

      expect(stats1).toEqual(stats2);
      expect(stats1).not.toBe(stats2);
    });
  });

  describe("resetStats()", () => {
    it("should reset request count", async () => {
      const fn = async () => "result";
      await limiter.execute(fn);

      limiter.resetStats();

      expect(limiter.getStats().requestCount).toBe(0);
    });

    it("should reset queued count", () => {
      limiter.resetStats();

      expect(limiter.getStats().queuedCount).toBe(0);
    });

    it("should reset both counters to zero", async () => {
      const fn = async () => "result";
      const promise1 = limiter.execute(fn);
      await vi.advanceTimersByTimeAsync(500);
      const promise2 = limiter.execute(fn);
      await vi.advanceTimersByTimeAsync(500);
      await promise1;
      await promise2;

      limiter.resetStats();

      expect(limiter.getStats()).toEqual({
        requestCount: 0,
        queuedCount: 0,
      });
    });
  });

  describe("isEnabled()", () => {
    it("should return true by default", () => {
      expect(limiter.isEnabled()).toBe(true);
    });

    it("should return false when disabled", () => {
      const disabledLimiter = new RateLimiter({ enabled: false });

      expect(disabledLimiter.isEnabled()).toBe(false);
    });

    it("should reflect current enabled state", () => {
      expect(limiter.isEnabled()).toBe(true);

      limiter.setEnabled(false);
      expect(limiter.isEnabled()).toBe(false);

      limiter.setEnabled(true);
      expect(limiter.isEnabled()).toBe(true);
    });
  });

  describe("setEnabled()", () => {
    it("should enable rate limiting", () => {
      const disabledLimiter = new RateLimiter({ enabled: false });

      disabledLimiter.setEnabled(true);

      expect(disabledLimiter.isEnabled()).toBe(true);
    });

    it("should disable rate limiting", () => {
      limiter.setEnabled(false);

      expect(limiter.isEnabled()).toBe(false);
    });

    it("should reset stats when disabling", async () => {
      const fn = async () => "result";
      await limiter.execute(fn);

      limiter.setEnabled(false);

      expect(limiter.getStats()).toEqual({
        requestCount: 0,
        queuedCount: 0,
      });
    });

    it("should not reset stats when enabling", () => {
      limiter.setEnabled(false);
      limiter.setEnabled(true);

      expect(limiter.getStats()).toEqual({
        requestCount: 0,
        queuedCount: 0,
      });
    });
  });

  describe("rate limiting behavior", () => {
    it("should respect configured limit", async () => {
      const customLimiter = new RateLimiter({ limit: 2, interval: 100 });
      const fn = async () => "result";

      await Promise.all([customLimiter.execute(fn), customLimiter.execute(fn)]);

      expect(customLimiter.getStats().requestCount).toBe(2);
    });

    it("should work with different interval settings", async () => {
      const fastLimiter = new RateLimiter({ limit: 10, interval: 50 });
      const fn = async () => "result";

      const results = await Promise.all([
        fastLimiter.execute(fn),
        fastLimiter.execute(fn),
        fastLimiter.execute(fn),
      ]);

      expect(results).toHaveLength(3);
      expect(fastLimiter.getStats().requestCount).toBe(3);
    });

    it("should handle strict vs non-strict mode", async () => {
      const nonStrictLimiter = new RateLimiter({
        limit: 2,
        interval: 100,
        strict: false,
      });
      const fn = async () => "result";

      await nonStrictLimiter.execute(fn);

      expect(nonStrictLimiter.getStats().requestCount).toBe(1);
    });
  });
});
