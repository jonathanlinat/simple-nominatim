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

import { CacheManager } from "./cacheManager";
import {
  FETCHER_BASE_URL,
  FETCHER_USER_AGENT,
  DEFAULT_CACHE_CONFIG,
  DEFAULT_RATE_LIMIT_CONFIG,
  DEFAULT_RETRY_CONFIG,
} from "./constants";
import { RateLimiter } from "./rateLimiter";

import type { DataFetcherOptions, RetryConfig } from "./_shared.types";

/**
 * Calculate delay with exponential backoff and optional jitter
 *
 * @param attempt Current retry attempt number
 * @param config Retry configuration
 * @returns Calculated delay in milliseconds
 */
const calculateDelay = (
  attempt: number,
  config: Required<RetryConfig>,
): number => {
  const exponentialDelay = Math.min(
    config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1),
    config.maxDelay,
  );

  if (config.useJitter) {
    return exponentialDelay * (0.5 + Math.random());
  }

  return exponentialDelay;
};

/**
 * Sleep for specified milliseconds
 *
 * @param ms Milliseconds to sleep
 * @returns Promise that resolves after the specified delay
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if HTTP error should be retried
 *
 * @param statusCode HTTP status code
 * @param attempt Current attempt number
 * @param retry Retry configuration
 * @returns True if should retry, false otherwise
 */
const shouldRetryHttpError = (
  statusCode: number,
  attempt: number,
  retry: Required<RetryConfig>,
): boolean =>
  retry.enabled &&
  attempt < retry.maxAttempts &&
  retry.retryableStatusCodes.includes(statusCode);

/**
 * Check if network error should be retried
 *
 * @param error Error object
 * @param attempt Current attempt number
 * @param retry Retry configuration
 * @returns True if should retry, false otherwise
 */
const shouldRetryNetworkError = (
  error: unknown,
  attempt: number,
  retry: Required<RetryConfig>,
): boolean => {
  const isNetworkError = !error || !(error as { status?: number }).status;

  return retry.enabled && attempt < retry.maxAttempts && isNetworkError;
};

/**
 * Parse response based on format
 *
 * @param response Fetch response
 * @param params URL search parameters
 * @returns Parsed response
 */
const parseResponse = async <T>(
  response: Response,
  params: URLSearchParams,
): Promise<T> => {
  const format = params.get("format");
  const isTextFormat = format === "text" || format === "xml";

  return isTextFormat
    ? ((await response.text()) as T)
    : ((await response.json()) as T);
};

/**
 * Generic HTTP fetcher for Nominatim API requests
 *
 * This internal function handles all HTTP communication with the Nominatim API.
 * It automatically sets the required User-Agent header, constructs the request URL,
 * and parses the response based on the requested format.
 *
 * Supports optional caching and rate limiting to optimize performance and respect
 * API usage policies.
 *
 * @template T - The expected response type (defaults to unknown)
 * @param {string} endpoint The API endpoint to call (e.g., 'search', 'reverse', 'status')
 * @param {URLSearchParams} params URL search parameters for the request
 * @param {DataFetcherOptions} options Optional cache and rate limiter configurations
 * @returns {Promise<T>} A promise that resolves to the parsed response data
 *
 * @throws {Error} If the HTTP request fails or returns a non-2xx status code
 *
 * @internal
 */
export const dataFetcher = async <T = unknown>(
  endpoint: string,
  params: URLSearchParams,
  options: DataFetcherOptions = {},
): Promise<T> => {
  const {
    cache: cacheConfig,
    rateLimit: rateLimitConfig,
    retry: retryConfig,
  } = options;

  const retry: Required<RetryConfig> = {
    ...DEFAULT_RETRY_CONFIG,
    ...retryConfig,
  };

  const cache = new CacheManager({
    ...DEFAULT_CACHE_CONFIG,
    ...cacheConfig,
  });

  const rateLimiter = new RateLimiter({
    ...DEFAULT_RATE_LIMIT_CONFIG,
    ...rateLimitConfig,
  });

  if (cache.isEnabled()) {
    const cachedResponse = cache.get(endpoint, params);

    if (cachedResponse !== undefined) {
      return cachedResponse as T;
    }
  }

  const performFetch = async (): Promise<T> => {
    const requestInfo = `${FETCHER_BASE_URL}/${endpoint}?${params.toString()}`;
    const requestInit = { headers: { "User-Agent": FETCHER_USER_AGENT } };

    let lastError: Error | undefined;
    let attempt = 0;

    while (attempt < (retry.enabled ? retry.maxAttempts : 1)) {
      attempt++;

      try {
        const requestResponse = await fetch(requestInfo, requestInit);

        if (!requestResponse.ok) {
          const statusCode = requestResponse.status;

          if (shouldRetryHttpError(statusCode, attempt, retry)) {
            await sleep(calculateDelay(attempt, retry));

            continue;
          }

          throw new Error(
            `HTTP error! Status: ${requestResponse.status}. Text: ${requestResponse.statusText}`,
          );
        }

        return await parseResponse<T>(requestResponse, params);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (shouldRetryNetworkError(error, attempt, retry)) {
          await sleep(calculateDelay(attempt, retry));

          continue;
        }

        throw lastError;
      }
    }

    throw lastError ?? new Error("Request failed after all retry attempts");
  };

  const response = rateLimiter.isEnabled()
    ? await rateLimiter.execute(performFetch)
    : await performFetch();

  if (cache.isEnabled()) {
    cache.set(endpoint, params, response as object);
  }

  return response;
};
