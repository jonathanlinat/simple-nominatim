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

import { geocodeReverse } from '@simple-nominatim/core'
import type {
  GeocodeReverseParams,
  ReverseOptions
} from '@simple-nominatim/core'

import { responseParser } from '../_shared/responseParser'
import type { GeocodeReverseArgv } from './reverse.types'

/**
 * CLI wrapper for reverse geocoding functionality
 *
 * This function wraps the core reverse geocoding functionality for use in the CLI.
 * It transforms CLI arguments with coordinates into the format expected by the
 * core library, executes the reverse geocoding, and outputs the results to the console.
 *
 * @param {GeocodeReverseArgv} argv - Command-line arguments from Yargs containing coordinates
 * @returns {Promise<void>} A promise that resolves when the reverse geocoding is complete
 *
 * @internal This is an internal CLI function called by the command handler
 *
 * @example
 * ```typescript
 * // Called internally by: simple-nominatim reverse:geocode --latitude "48.8584" --longitude "2.2945" --format json
 * await geocodeReverseWrapper({
 *   latitude: '48.8584',
 *   longitude: '2.2945',
 *   format: 'json'
 * });
 * ```
 */
export const geocodeReverseWrapper = (
  argv: GeocodeReverseArgv
): Promise<void> => {
  const { email, format, latitude, longitude } = argv

  const params: GeocodeReverseParams = { latitude, longitude }
  const options: ReverseOptions = { email, format }

  const response = geocodeReverse(params, options)
  const handledResponse = responseParser(response)

  return handledResponse
}
