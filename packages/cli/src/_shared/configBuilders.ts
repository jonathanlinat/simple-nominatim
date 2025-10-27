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

import type {
  CacheConfig,
  RateLimitConfig,
  RetryConfig,
} from "@simple-nominatim/core";

/**
 * Interface for command-line arguments that include cache configuration
 */
interface CacheArgv {
  noCache?: boolean;
  cacheTtl?: number;
  cacheMaxSize?: number;
}

/**
 * Interface for command-line arguments that include retry configuration
 */
interface RetryArgv {
  noRetry?: boolean;
  retryMaxAttempts?: number;
  retryInitialDelay?: number;
}

/**
 * Build cache configuration from command-line arguments
 *
 * @param {CacheArgv} argv Command-line arguments containing cache parameters
 * @returns {CacheConfig | undefined} Cache configuration object, or undefined if no cache params provided
 *
 * @internal
 */
export const buildCacheConfig = (argv: CacheArgv): CacheConfig | undefined => {
  const { noCache, cacheTtl, cacheMaxSize } = argv;

  if (
    noCache !== true &&
    cacheTtl === undefined &&
    cacheMaxSize === undefined
  ) {
    return undefined;
  }

  const config: CacheConfig = {};

  if (noCache === true) {
    config.enabled = false;
  }

  if (cacheTtl !== undefined) {
    config.ttl = cacheTtl;
  }

  if (cacheMaxSize !== undefined) {
    config.maxSize = cacheMaxSize;
  }

  return Object.keys(config).length > 0 ? config : undefined;
};

/**
 * Build rate limit configuration from command-line arguments
 *
 * @param {object} options Command-line arguments containing rate limit parameters
 * @param {boolean} [options.noRateLimit] Disable rate limiting entirely
 * @param {number} [options.rateLimit] Maximum number of requests per interval
 * @param {number} [options.rateLimitInterval] Time interval in milliseconds
 * @returns {RateLimitConfig | undefined} Rate limit configuration object, or undefined if no rate limit params provided
 *
 * @internal
 */
export function buildRateLimitConfig(options: {
  noRateLimit?: boolean;
  rateLimit?: number;
  rateLimitInterval?: number;
}): RateLimitConfig | undefined {
  const { noRateLimit, rateLimit, rateLimitInterval } = options;

  const numericRateLimit =
    typeof rateLimit === "number" ? rateLimit : undefined;

  if (
    noRateLimit !== true &&
    numericRateLimit === undefined &&
    rateLimitInterval === undefined
  ) {
    return undefined;
  }

  const config: RateLimitConfig = {};

  if (noRateLimit === true) {
    config.enabled = false;
  }

  if (numericRateLimit !== undefined) {
    config.limit = numericRateLimit;
  }

  if (rateLimitInterval !== undefined) {
    config.interval = rateLimitInterval;
  }

  return Object.keys(config).length > 0 ? config : undefined;
}

/**
 * Build retry configuration from command-line arguments
 *
 * @param {RetryArgv} argv Command-line arguments containing retry parameters
 * @returns {RetryConfig | undefined} Retry configuration object, or undefined if no retry params provided
 *
 * @internal
 */
export const buildRetryConfig = (argv: RetryArgv): RetryConfig | undefined => {
  const { noRetry, retryMaxAttempts, retryInitialDelay } = argv;

  if (
    noRetry !== true &&
    retryMaxAttempts === undefined &&
    retryInitialDelay === undefined
  ) {
    return undefined;
  }

  const config: RetryConfig = {};

  if (noRetry === true) {
    config.enabled = false;
  }

  if (retryMaxAttempts !== undefined) {
    config.maxAttempts = retryMaxAttempts;
  }

  if (retryInitialDelay !== undefined) {
    config.initialDelay = retryInitialDelay;
  }

  return Object.keys(config).length > 0 ? config : undefined;
};
