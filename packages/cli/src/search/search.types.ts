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

import type { OutputFormat } from "@simple-nominatim/core";

/**
 * CLI arguments for free-form search command
 */
export interface FreeFormArgv {
  /**
   * Email address for identification
   */
  email?: string;
  /**
   * Output format
   */
  format: OutputFormat;
  /**
   * Maximum number of results
   */
  limit?: number;
  /**
   * Free-form query string
   */
  query: string;
  /**
   * Disable caching
   */
  noCache?: boolean;
  /**
   * Cache TTL in milliseconds
   */
  cacheTtl?: number;
  /**
   * Cache max size
   */
  cacheMaxSize?: number;
  /**
   * Disable rate limiting
   */
  noRateLimit?: boolean;
  /**
   * Rate limit requests per interval
   */
  rateLimit?: number;
  /**
   * Rate limit interval in milliseconds
   */
  rateLimitInterval?: number;
  /**
   * Disable retry logic
   */
  noRetry?: boolean;
  /**
   * Retry max attempts
   */
  retryMaxAttempts?: number;
  /**
   * Retry initial delay in milliseconds
   */
  retryInitialDelay?: number;
}

/**
 * CLI arguments for structured search command
 */
export interface StructuredArgv {
  /**
   * Name or type of POI
   */
  amenity?: string;
  /**
   * City name
   */
  city?: string;
  /**
   * Country name
   */
  country?: string;
  /**
   * County name
   */
  county?: string;
  /**
   * Email address for identification
   */
  email?: string;
  /**
   * Output format
   */
  format: OutputFormat;
  /**
   * Maximum number of results
   */
  limit?: number;
  /**
   * Postal code
   */
  postalcode?: string;
  /**
   * State name
   */
  state?: string;
  /**
   * Street name and number
   */
  street?: string;
  /**
   * Disable caching
   */
  noCache?: boolean;
  /**
   * Cache TTL in milliseconds
   */
  cacheTtl?: number;
  /**
   * Cache max size
   */
  cacheMaxSize?: number;
  /**
   * Disable rate limiting
   */
  noRateLimit?: boolean;
  /**
   * Rate limit requests per interval
   */
  rateLimit?: number;
  /**
   * Rate limit interval in milliseconds
   */
  rateLimitInterval?: number;
  /**
   * Disable retry logic
   */
  noRetry?: boolean;
  /**
   * Retry max attempts
   */
  retryMaxAttempts?: number;
  /**
   * Retry initial delay in milliseconds
   */
  retryInitialDelay?: number;
}
