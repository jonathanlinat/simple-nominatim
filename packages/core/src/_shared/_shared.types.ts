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

import type { CacheConfig } from './cacheManager'
import type { RateLimitConfig } from './rateLimiter'

/**
 * Retry configuration for failed requests
 */
export interface RetryConfig {
  /**
   * Enable or disable retry logic
   * @default true
   */
  enabled?: boolean
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxAttempts?: number
  /**
   * Initial delay in milliseconds before first retry
   * @default 1000
   */
  initialDelay?: number
  /**
   * Maximum delay between retries in milliseconds
   * @default 10000 (10 seconds)
   */
  maxDelay?: number
  /**
   * Multiplier for exponential backoff
   * @default 2
   */
  backoffMultiplier?: number
  /**
   * Whether to add random jitter to delays
   * @default true
   */
  useJitter?: boolean
  /**
   * HTTP status codes that should trigger a retry
   * @default [408, 429, 500, 502, 503, 504]
   */
  retryableStatusCodes?: number[]
}

/**
 * Output format types supported by Nominatim API
 */
export type OutputFormat = 'xml' | 'json' | 'jsonv2' | 'geojson' | 'geocodejson'

/**
 * Common options for search and reverse geocoding requests
 */
export interface BaseOptions {
  /**
   * Email address for identification when making large numbers of requests
   */
  email?: string
  /**
   * Output format for the response
   */
  format: OutputFormat
  /**
   * Cache configuration for response caching (optional)
   */
  cache?: CacheConfig
  /**
   * Rate limiter configuration for request throttling (optional)
   */
  rateLimit?: RateLimitConfig
  /**
   * Retry configuration for failed requests (optional)
   */
  retry?: RetryConfig
  /**
   * Index signature for additional query parameters
   */
  [key: string]: string | number | CacheConfig | RateLimitConfig | RetryConfig | undefined
}

/**
 * Options specific to search requests
 */
export interface SearchOptions extends BaseOptions {
  /**
   * Maximum number of returned results (cannot be more than 40)
   */
  limit?: number
}

/**
 * Alias for reverse geocoding options
 */
export type ReverseOptions = BaseOptions

/**
 * Options for data fetching with caching, rate limiting, and retries
 */
export interface DataFetcherOptions {
  /**
   * Cache configuration for response caching
   */
  cache?: CacheConfig
  /**
   * Rate limiter configuration for request throttling
   */
  rateLimit?: RateLimitConfig
  /**
   * Retry configuration for failed requests
   */
  retry?: RetryConfig
}
