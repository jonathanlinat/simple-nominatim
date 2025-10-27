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

import type { RetryConfig } from "../_shared/_shared.types";
import type { CacheConfig } from "../_shared/cacheManager";
import type { RateLimitConfig } from "../_shared/rateLimiter";

/**
 * Status format types supported by Nominatim API
 */
export type StatusFormat = "text" | "json";

/**
 * Successful status response when format is 'json'
 */
export interface StatusSuccessResponse {
  /**
   * Status code (0 indicates success)
   */
  status: 0;
  /**
   * Status message
   */
  message: "OK";
  /**
   * ISO 8601 timestamp of last database update
   */
  data_updated: string;
  /**
   * Version of Nominatim software serving the API
   */
  software_version: string;
  /**
   * Version of the data format in the database
   */
  database_version: string;
}

/**
 * Error status response when format is 'json'
 */
export interface StatusErrorResponse {
  /**
   * Error status code (e.g., 700 for database connection failure)
   */
  status: number;
  /**
   * Error message describing the failure
   */
  message: string;
}

/**
 * Union type for JSON format status responses
 */
export type StatusJsonResponse = StatusSuccessResponse | StatusErrorResponse;

/**
 * Helper type guard to check if status response is successful
 *
 * @param response The status response to check
 * @returns True if the response indicates success (status === 0)
 */
export function isStatusSuccess(
  response: StatusJsonResponse,
): response is StatusSuccessResponse {
  return response.status === 0;
}

/**
 * Options for service status requests
 */
export interface StatusOptions {
  /**
   * Output format for the status response
   * @default 'text'
   */
  format?: StatusFormat;
  /**
   * Cache configuration for response caching (optional)
   */
  cache?: CacheConfig;
  /**
   * Rate limiter configuration for request throttling (optional)
   */
  rateLimit?: RateLimitConfig;
  /**
   * Retry configuration for failed requests (optional)
   */
  retry?: RetryConfig;
  /**
   * Index signature for additional query parameters
   */
  [key: string]:
    | string
    | number
    | CacheConfig
    | RateLimitConfig
    | RetryConfig
    | undefined;
}
