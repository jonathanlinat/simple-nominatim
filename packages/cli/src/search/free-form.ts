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

import { freeFormSearch } from "@simple-nominatim/core";
import type {
  FreeFormSearchParams,
  SearchOptions,
  RetryConfig,
} from "@simple-nominatim/core";

import { responseParser } from "../_shared/responseParser";
import {
  safeValidateArgs,
  freeFormSearchSchema,
  handleValidationError,
} from "../_shared/validation";

import type { FreeFormArgv } from "./search.types";

/**
 * CLI wrapper for free-form search functionality
 *
 * This function wraps the core free-form search functionality for use in the CLI.
 * It transforms CLI arguments into the format expected by the core library,
 * executes the search, and outputs the results to the console.
 *
 * Supports optional configuration overrides for caching, rate limiting, and retry logic.
 * When no configuration flags are provided, sensible defaults are applied automatically.
 *
 * @param {FreeFormArgv} argv Command-line arguments from Yargs
 * @param {string} argv.query Free-form query string to search (required)
 * @param {string} [argv.email] Email address for identification when making large numbers of requests
 * @param {OutputFormat} argv.format Output format (required)
 * @param {number} [argv.limit] Maximum number of returned results (cannot be more than 40)
 * @param {boolean} [argv.noCache] Disable response caching
 * @param {number} [argv.cacheTtl] Cache time-to-live in milliseconds
 * @param {number} [argv.cacheMaxSize] Maximum number of cached entries
 * @param {boolean} [argv.noRateLimit] Disable rate limiting
 * @param {number} [argv.rateLimit] Maximum number of requests per interval
 * @param {number} [argv.rateLimitInterval] Time interval in milliseconds for rate limiting
 * @param {boolean} [argv.noRetry] Disable retry logic on failures
 * @param {number} [argv.retryMaxAttempts] Maximum number of retry attempts
 * @param {number} [argv.retryInitialDelay] Initial delay in milliseconds before first retry
 * @returns {Promise<void>} A promise that resolves when the search is complete
 *
 * @internal
 */
export const freeFormSearchWrapper = (argv: FreeFormArgv): Promise<void> => {
  const {
    email,
    format,
    limit,
    query,
    noCache,
    cacheTtl,
    cacheMaxSize,
    noRateLimit,
    rateLimit,
    rateLimitInterval,
    noRetry,
    retryMaxAttempts,
    retryInitialDelay,
  } = argv;

  const validationResult = safeValidateArgs(freeFormSearchSchema, {
    query,
    outputFormat: format,
    email,
    limit,
  });

  if (!validationResult.success) {
    handleValidationError(validationResult.error);
  }

  const params: FreeFormSearchParams = { query };
  const options: SearchOptions = { email, format, limit };

  if (
    noCache !== undefined ||
    cacheTtl !== undefined ||
    cacheMaxSize !== undefined
  ) {
    options.cache = {
      ...(noCache && { enabled: false }),
      ...(cacheTtl !== undefined && { ttl: cacheTtl }),
      ...(cacheMaxSize !== undefined && { maxSize: cacheMaxSize }),
    };
  }

  if (
    noRateLimit !== undefined ||
    rateLimit !== undefined ||
    rateLimitInterval !== undefined
  ) {
    options.rateLimit = {
      ...(noRateLimit && { enabled: false }),
      ...(rateLimit !== undefined && { limit: rateLimit }),
      ...(rateLimitInterval !== undefined && { interval: rateLimitInterval }),
    };
  }

  if (
    noRetry !== undefined ||
    retryMaxAttempts !== undefined ||
    retryInitialDelay !== undefined
  ) {
    options.retry = {
      ...(noRetry && { enabled: false }),
      ...(retryMaxAttempts !== undefined && { maxAttempts: retryMaxAttempts }),
      ...(retryInitialDelay !== undefined && {
        initialDelay: retryInitialDelay,
      }),
    } as RetryConfig;
  }

  const response = freeFormSearch(params, options);
  const handledResponse = responseParser(response);

  return handledResponse;
};
