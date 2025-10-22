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
import type { ReverseOptions } from '../_shared/_shared.types'
import type { GeocodeReverseParams } from './reverse.types'

export type { GeocodeReverseParams } from './reverse.types'
export type { ReverseOptions } from '../_shared/_shared.types'

/**
 * Performs reverse geocoding using the Nominatim API
 *
 * This function converts geographic coordinates (latitude and longitude) into a
 * human-readable address. It queries the Nominatim API to find the nearest
 * address or place for the given coordinates.
 *
 * @template T - The expected response type (defaults to unknown)
 * @param {GeocodeReverseParams} params - The coordinates to reverse geocode (latitude and longitude)
 * @param {ReverseOptions} options - Configuration options for the reverse geocoding request
 * @returns {Promise<T>} A promise that resolves to the reverse geocoding result
 *
 * @throws {Error} If the HTTP request fails or returns a non-2xx status code
 *
 * @example
 * ```typescript
 * // Reverse geocode coordinates
 * const result = await geocodeReverse(
 *   { latitude: '37.4219999', longitude: '-122.0840575' },
 *   { format: 'json' }
 * );
 * // Returns address information for the Googleplex location
 * ```
 *
 * @example
 * ```typescript
 * // Reverse geocode with email identification
 * const result = await geocodeReverse(
 *   { latitude: '48.8584', longitude: '2.2945' },
 *   { format: 'jsonv2', email: 'user@example.com' }
 * );
 * // Returns address information for the Eiffel Tower
 * ```
 *
 * @see {@link https://nominatim.org/release-docs/develop/api/Reverse/ | Nominatim Reverse Geocoding API Documentation}
 */
export const geocodeReverse = async <T = unknown>(
  params: GeocodeReverseParams,
  options: ReverseOptions
): Promise<T> => {
  const endpoint = 'reverse'
  const urlSearchParams = new URLSearchParams()

  const { latitude: lat, longitude: lon } = params
  const parsedParams = { lat, lon }

  Object.keys(parsedParams).forEach((key) => {
    const value = parsedParams[key as keyof typeof parsedParams]
    if (value) {
      urlSearchParams.append(key, value)
    }
  })

  Object.keys(options).forEach((key) => {
    const value = options[key]
    if (value !== undefined) {
      urlSearchParams.append(key, String(value))
    }
  })

  const fetchedData = await dataFetcher<T>(endpoint, urlSearchParams)

  return fetchedData
}
