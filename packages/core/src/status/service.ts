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

import { dataFetcher } from "../_shared/dataFetcher";

import type { StatusOptions } from "./status.types";

/**
 * Checks the status of the Nominatim API service
 *
 * This function queries the status endpoint to retrieve information about the
 * Nominatim service health, database status, and software version. Useful for
 * monitoring and health checks.
 *
 * Output format behavior:
 * - **Text format** (default): Returns HTTP 200 with "OK" on success, HTTP 500 with error message on failure
 * - **JSON format**: Always returns HTTP 200. Success includes `status: 0` with version info. Errors include `status: 700+` with message only
 *
 * JSON success response includes:
 * - `status`: 0 (success code)
 * - `message`: "OK"
 * - `data_updated`: ISO 8601 timestamp of last database update
 * - `software_version`: Nominatim version serving the API
 * - `database_version`: Data format version in the database
 *
 * @template T - The expected response type (defaults to unknown)
 * @param {StatusOptions} options Configuration options for the status request
 * @returns {Promise<T>} A promise that resolves to the status information
 *
 * @throws {Error} If the HTTP request fails (text format may throw on HTTP 500)
 *
 * @example
 * ```typescript
 * // Text format (default)
 * const textStatus = await serviceStatus({ format: 'text' });
 * // Returns: "OK"
 *
 * // JSON format with type safety
 * const jsonStatus = await serviceStatus<StatusJsonResponse>({ format: 'json' });
 * if (jsonStatus.status === 0) {
 *   console.log(`Last updated: ${jsonStatus.data_updated}`);
 * }
 *
 * // No parameters (uses default text format)
 * const status = await serviceStatus({});
 * ```
 *
 * @see {@link https://nominatim.org/release-docs/develop/api/Status/ | Nominatim Status API Documentation}
 */
export const serviceStatus = async <T = unknown>(
  options: StatusOptions,
): Promise<T> => {
  const endpoint = "status";
  const urlSearchParams = new URLSearchParams();

  const { cache, rateLimit, retry, ...apiOptions } = options;

  Object.keys(apiOptions).forEach((key) => {
    const value = apiOptions[key as keyof typeof apiOptions];

    if (value !== undefined) {
      urlSearchParams.append(key, String(value));
    }
  });

  const fetchedData = await dataFetcher<T>(endpoint, urlSearchParams, {
    cache,
    rateLimit,
    retry,
  });

  return fetchedData;
};
