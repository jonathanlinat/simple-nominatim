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

import type { FreeFormSearchParams } from "./search.types";
import type { SearchOptions } from "../_shared/_shared.types";

/**
 * Performs a free-form search query using the Nominatim API
 *
 * This function allows you to search for locations using a single free-text query string,
 * similar to what you would type into a search engine. The Nominatim API will attempt
 * to parse the query and return matching locations.
 *
 * @template T - The expected response type (defaults to unknown)
 * @param {FreeFormSearchParams} params The search parameters containing the query string
 * @param {SearchOptions} options Configuration options for the search request
 * @returns {Promise<T>} A promise that resolves to the search results
 *
 * @throws {Error} If the HTTP request fails or returns a non-2xx status code
 *
 * @see {@link https://nominatim.org/release-docs/develop/api/Search/ | Nominatim Search API Documentation}
 */
export const freeFormSearch = async <T = unknown>(
  params: FreeFormSearchParams,
  options: SearchOptions,
): Promise<T> => {
  const endpoint = "search";
  const urlSearchParams = new URLSearchParams();

  const { query: q } = params;
  const parsedParams = { q };

  for (const key of Object.keys(parsedParams)) {
    const value = parsedParams[key as keyof typeof parsedParams];

    if (value) {
      urlSearchParams.append(key, value);
    }
  }

  const { cache, rateLimit, retry, ...apiOptions } = options;

  for (const key of Object.keys(apiOptions)) {
    const value = apiOptions[key as keyof typeof apiOptions];

    if (value !== undefined) {
      urlSearchParams.append(key, String(value));
    }
  }

  return await dataFetcher<T>(endpoint, urlSearchParams, {
    cache,
    rateLimit,
    retry,
  });
};
