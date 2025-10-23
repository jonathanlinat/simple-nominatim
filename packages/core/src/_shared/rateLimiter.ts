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

import pThrottle from "p-throttle";

/**
 * Configuration options for rate limiting
 */
export interface RateLimitConfig {
  /**
   * Enable or disable rate limiting
   * @default true
   */
  enabled?: boolean;

  /**
   * Maximum number of requests per interval
   * @default 1 (respects Nominatim's 1 req/sec guideline)
   */
  limit?: number;

  /**
   * Time interval in milliseconds
   * @default 1000 (1 second)
   */
  interval?: number;

  /**
   * Whether to use strict rate limiting (prevents bursts)
   * @default true
   */
  strict?: boolean;
}

/**
 * Rate limiter for Nominatim API requests
 *
 * Implements rate limiting to respect the OpenStreetMap Foundation's
 * usage policy of maximum 1 request per second. Can be configured
 * for different rate limits if needed.
 *
 * @internal
 */
export class RateLimiter {
  private throttle: ReturnType<typeof pThrottle>;
  private enabled: boolean;
  private requestCount = 0;
  private queuedCount = 0;

  /**
   * Creates a new RateLimiter instance
   *
   * @param config Rate limiter configuration options
   */
  constructor(config: RateLimitConfig = {}) {
    this.enabled = config.enabled ?? true;

    const limit = config.limit ?? 1;
    const interval = config.interval ?? 1000;
    const strict = config.strict ?? true;

    this.throttle = pThrottle({
      limit,
      interval,
      strict,
    });
  }

  /**
   * Execute a function with rate limiting
   *
   * @param fn The function to execute
   * @returns A promise that resolves with the function result
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.enabled) {
      return fn();
    }

    this.queuedCount++;

    try {
      const throttledFn = this.throttle(fn);
      const result = await throttledFn();

      this.requestCount++;

      return result;
    } finally {
      this.queuedCount--;
    }
  }

  /**
   * Get rate limiter statistics
   *
   * @returns Object containing request count and queued count
   */
  getStats(): { requestCount: number; queuedCount: number } {
    return {
      requestCount: this.requestCount,
      queuedCount: this.queuedCount,
    };
  }

  /**
   * Reset the rate limiter statistics
   */
  resetStats(): void {
    this.requestCount = 0;
    this.queuedCount = 0;
  }

  /**
   * Check if rate limiting is enabled
   *
   * @returns True if rate limiting is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enable or disable rate limiting
   *
   * @param enabled Whether to enable rate limiting
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;

    if (!enabled) {
      this.resetStats();
    }
  }
}
