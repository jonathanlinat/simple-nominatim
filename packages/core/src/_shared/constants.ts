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

import type { RetryConfig } from "./_shared.types";
import type { CacheConfig } from "./cacheManager";
import type { RateLimitConfig } from "./rateLimiter";

/**
 * Base URL for the Nominatim API
 *
 * @constant
 * @default 'https://nominatim.openstreetmap.org'
 */
export const FETCHER_BASE_URL: string = "https://nominatim.openstreetmap.org";

/**
 * User-Agent string sent with all API requests
 *
 * @constant
 * @default '@simple-nominatim/core'
 */
export const FETCHER_USER_AGENT: string = "@simple-nominatim/core";

/**
 * Default cache configuration
 * Based on Nominatim recommendations for reasonable caching
 *
 * - enabled: true
 * - ttl: 300000 (5 minutes)
 * - maxSize: 500
 *
 * @constant
 */
export const DEFAULT_CACHE_CONFIG: Required<CacheConfig> = {
  enabled: true,
  ttl: 300000,
  maxSize: 500,
};

/**
 * Default rate limiter configuration
 * Respects Nominatim's usage policy of 1 request per second
 *
 * - enabled: true
 * - limit: 1 (1 request per interval)
 * - interval: 1000 (1 second)
 * - strict: true
 *
 * @constant
 * @see https://operations.osmfoundation.org/policies/nominatim/
 */
export const DEFAULT_RATE_LIMIT_CONFIG: Required<RateLimitConfig> = {
  enabled: true,
  limit: 1,
  interval: 1000,
  strict: true,
};

/**
 * Default retry configuration
 * Implements exponential backoff for transient failures
 *
 * - enabled: true
 * - maxAttempts: 3
 * - initialDelay: 1000 (1 second)
 * - maxDelay: 10000 (10 seconds)
 * - backoffMultiplier: 2
 * - useJitter: true
 * - retryableStatusCodes: [408, 429, 500, 502, 503, 504]
 *
 * @constant
 */
export const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  enabled: true,
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  useJitter: true,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
};
