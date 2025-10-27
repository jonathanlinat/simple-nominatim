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

import type { OutputFormat } from "@simple-nominatim/core";

/**
 * CLI arguments for reverse geocoding command
 */
export interface GeocodeReverseArgv {
  /**
   * Email address for identification
   */
  email?: string;
  /**
   * Output format
   */
  format: OutputFormat;
  /**
   * Latitude coordinate
   */
  latitude: string;
  /**
   * Longitude coordinate
   */
  longitude: string;
  /**
   * Include a breakdown of the address into elements (0 or 1)
   */
  addressdetails?: 0 | 1;
  /**
   * Include additional information available in the database (0 or 1)
   */
  extratags?: 0 | 1;
  /**
   * Include a full list of names for the result (0 or 1)
   */
  namedetails?: 0 | 1;
  /**
   * Include the tagged entrances in the result (0 or 1)
   */
  entrances?: 0 | 1;
  /**
   * Preferred language order for showing results
   */
  acceptLanguage?: string;
  /**
   * Level of detail required for the address (0-18)
   */
  zoom?: number;
  /**
   * Select places by themes (comma-separated list)
   */
  layer?: string;
  /**
   * Include full geometry in GeoJSON format (0 or 1)
   */
  polygonGeojson?: 0 | 1;
  /**
   * Include full geometry in KML format (0 or 1)
   */
  polygonKml?: 0 | 1;
  /**
   * Include full geometry in SVG format (0 or 1)
   */
  polygonSvg?: 0 | 1;
  /**
   * Include full geometry in WKT format (0 or 1)
   */
  polygonText?: 0 | 1;
  /**
   * Tolerance in degrees for simplified geometry output
   */
  polygonThreshold?: number;
  /**
   * JSONP callback function name
   */
  jsonCallback?: string;
  /**
   * Output assorted developer debug information (0 or 1)
   */
  debug?: 0 | 1;
  /**
   * Disable caching
   */
  noCache?: boolean;
  /**
   * Cache TTL in milliseconds
   */
  cacheTtl?: number;
  /**
   * Cache max size
   */
  cacheMaxSize?: number;
  /**
   * Disable rate limiting
   */
  noRateLimit?: boolean;
  /**
   * Rate limit requests per interval
   */
  rateLimit?: number;
  /**
   * Rate limit interval in milliseconds
   */
  rateLimitInterval?: number;
  /**
   * Disable retry logic
   */
  noRetry?: boolean;
  /**
   * Retry max attempts
   */
  retryMaxAttempts?: number;
  /**
   * Retry initial delay in milliseconds
   */
  retryInitialDelay?: number;
}
