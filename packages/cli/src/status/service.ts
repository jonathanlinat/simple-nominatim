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

import { serviceStatus } from "@simple-nominatim/core";
import type { StatusOptions, RetryConfig } from "@simple-nominatim/core";

import { responseParser } from "../_shared/responseParser";
import {
  safeValidateArgs,
  serviceStatusSchema,
  handleValidationError,
} from "../_shared/validation";

import type { ServiceStatusArgv } from "./status.types";

/**
 * CLI wrapper for service status functionality
 *
 * This function wraps the core service status functionality for use in the CLI.
 * It executes the status check and outputs the results to the console in the specified format.
 *
 * Supports optional configuration overrides for caching, rate limiting, and retry logic.
 * When no configuration flags are provided, sensible defaults are applied automatically.
 *
 * @param {ServiceStatusArgv} argv Command-line arguments from Commander containing output format and optional configuration
 * @param {OutputFormat} argv.format Output format (required)
 * @param {boolean} [argv.noCache] Disable response caching
 * @param {number} [argv.cacheTtl] Cache time-to-live in milliseconds
 * @param {number} [argv.cacheMaxSize] Maximum number of cached entries
 * @param {boolean} [argv.noRateLimit] Disable rate limiting
 * @param {number} [argv.rateLimit] Maximum number of requests per interval
 * @param {number} [argv.rateLimitInterval] Time interval in milliseconds for rate limiting
 * @param {boolean} [argv.noRetry] Disable retry logic on failures
 * @param {number} [argv.retryMaxAttempts] Maximum number of retry attempts
 * @param {number} [argv.retryInitialDelay] Initial delay in milliseconds before first retry
 * @returns {Promise<void>} A promise that resolves when the status check is complete
 *
 * @internal
 */
export const serviceStatusWrapper = (
  argv: ServiceStatusArgv,
): Promise<void> => {
  const {
    format,
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

  const validationResult = safeValidateArgs(serviceStatusSchema, {
    statusFormat: format,
  });

  if (!validationResult.success) {
    handleValidationError(validationResult.error);
  }

  const options: StatusOptions = { format };

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

  const response = serviceStatus(options);
  const handledResponse = responseParser(response);

  return handledResponse;
};
