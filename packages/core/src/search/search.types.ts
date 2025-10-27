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

/**
 * Parameters for free-form search query
 */
export interface FreeFormSearchParams {
  /**
   * Free-form query string to search for
   */
  query: string;
}

/**
 * Parameters for structured search query
 */
export interface StructuredSearchParams {
  /**
   * Name or type of point of interest (POI)
   */
  amenity?: string;
  /**
   * City name
   */
  city?: string;
  /**
   * Country name
   */
  country?: string;
  /**
   * County name
   */
  county?: string;
  /**
   * Postal code
   */
  postalcode?: string;
  /**
   * State name
   */
  state?: string;
  /**
   * House number and street name
   */
  street?: string;
  /**
   * Index signature for additional search parameters
   */
  [key: string]: string | undefined;
}
