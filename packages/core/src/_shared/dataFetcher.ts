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

import { FETCHER_BASE_URL, FETCHER_USER_AGENT } from './constants'

/**
 * Generic HTTP fetcher for Nominatim API requests
 *
 * This internal function handles all HTTP communication with the Nominatim API.
 * It automatically sets the required User-Agent header, constructs the request URL,
 * and parses the response based on the requested format.
 *
 * @template T - The expected response type (defaults to unknown)
 * @param {string} endpoint - The API endpoint to call (e.g., 'search', 'reverse', 'status')
 * @param {URLSearchParams} params - URL search parameters for the request
 * @returns {Promise<T>} A promise that resolves to the parsed response data
 *
 * @throws {Error} If the HTTP request fails or returns a non-2xx status code
 *
 * @internal This is an internal utility function not meant for direct external use
 *
 * @example
 * ```typescript
 * const params = new URLSearchParams({ format: 'json', q: 'Paris' });
 * const result = await dataFetcher('search', params);
 * ```
 */
export const dataFetcher = async <T = unknown>(
  endpoint: string,
  params: URLSearchParams
): Promise<T> => {
  const requestInfo = `${FETCHER_BASE_URL}/${endpoint}?${params.toString()}`
  const requestInit = { headers: { 'User-Agent': FETCHER_USER_AGENT } }

  const requestResponse = await fetch(requestInfo, requestInit)

  if (!requestResponse.ok) {
    throw new Error(
      `HTTP error! Status: ${requestResponse.status}. Text: ${requestResponse.statusText}`
    )
  }

  const parsedRequestResponse =
    params.get('format') === 'text' || params.get('format') === 'xml'
      ? await requestResponse.text()
      : await requestResponse.json()

  return parsedRequestResponse as T
}
