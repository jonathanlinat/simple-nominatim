/**
 * MIT License
 *
 * Copyright (c) 2023-2024 Jonathan Linat <https://github.com/jonathanlinat>
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

/**
 * Output format types supported by Nominatim API
 */
export type OutputFormat = 'xml' | 'json' | 'jsonv2' | 'geojson' | 'geocodejson'

/**
 * Common options for search and reverse geocoding requests
 */
export interface BaseOptions {
  /**
   * Email address for identification when making large numbers of requests
   */
  email?: string
  /**
   * Output format for the response
   */
  format: OutputFormat
  /**
   * Index signature for additional query parameters
   */
  [key: string]: string | number | undefined
}

/**
 * Options specific to search requests
 */
export interface SearchOptions extends BaseOptions {
  /**
   * Maximum number of returned results (cannot be more than 40)
   */
  limit?: number
}

/**
 * Alias for reverse geocoding options
 */
export type ReverseOptions = BaseOptions
