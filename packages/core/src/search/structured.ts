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

import { dataFetcher } from '../_shared/dataFetcher'

import type { StructuredSearchParams } from './search.types'
import type { SearchOptions } from '../_shared/_shared.types'

/**
 * Performs a structured search query using the Nominatim API
 *
 * This function allows you to search for locations using structured address components
 * (city, street, country, etc.) rather than a free-form query. This can provide more
 * precise results when you have structured address data.
 *
 * @template T - The expected response type (defaults to unknown)
 * @param {StructuredSearchParams} params The structured address parameters (city, street, country, etc.)
 * @param {SearchOptions} options Configuration options for the search request
 * @returns {Promise<T>} A promise that resolves to the search results
 *
 * @throws {Error} If the HTTP request fails or returns a non-2xx status code
 *
 * @see {@link https://nominatim.org/release-docs/develop/api/Search/ | Nominatim Search API Documentation}
 */
export const structuredSearch = async <T = unknown>(
  params: StructuredSearchParams,
  options: SearchOptions
): Promise<T> => {
  const endpoint = 'search'
  const urlSearchParams = new URLSearchParams()

  Object.keys(params).forEach((key) => {
    const value = params[key as keyof typeof params]

    if (value) {
      urlSearchParams.append(key, value)
    }
  })

  const { cache, rateLimit, retry, ...apiOptions } = options

  Object.keys(apiOptions).forEach((key) => {
    const value = apiOptions[key as keyof typeof apiOptions]

    if (value !== undefined) {
      urlSearchParams.append(key, String(value))
    }
  })

  const fetchedData = await dataFetcher<T>(endpoint, urlSearchParams, {
    cache,
    rateLimit,
    retry
  })

  return fetchedData
}
