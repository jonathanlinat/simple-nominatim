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
 * CLI arguments for free-form search command
 */
export interface FreeFormArgv {
  /**
   * Email address for identification
   */
  email?: string;
  /**
   * Output format
   */
  format: OutputFormat;
  /**
   * Maximum number of results
   */
  limit?: number;
  /**
   * Free-form query string
   */
  query: string;
  /**
   * Include address breakdown (0 or 1)
   */
  addressdetails?: 0 | 1;
  /**
   * Include extra tags (0 or 1)
   */
  extratags?: 0 | 1;
  /**
   * Include name details (0 or 1)
   */
  namedetails?: 0 | 1;
  /**
   * Include entrances (0 or 1)
   */
  entrances?: 0 | 1;
  /**
   * Preferred language order
   */
  acceptLanguage?: string;
  /**
   * Limit to country codes (comma-separated)
   */
  countrycodes?: string;
  /**
   * Select places by themes
   */
  layer?: string;
  /**
   * Fine-grained address layer selection
   */
  featuretype?: "country" | "state" | "city" | "settlement";
  /**
   * Exclude place IDs (comma-separated)
   */
  excludePlaceIds?: string;
  /**
   * Bounding box (x1,y1,x2,y2)
   */
  viewbox?: string;
  /**
   * Restrict to viewbox (0 or 1)
   */
  bounded?: 0 | 1;
  /**
   * Include polygon in GeoJSON (0 or 1)
   */
  polygonGeojson?: 0 | 1;
  /**
   * Include polygon in KML (0 or 1)
   */
  polygonKml?: 0 | 1;
  /**
   * Include polygon in SVG (0 or 1)
   */
  polygonSvg?: 0 | 1;
  /**
   * Include polygon in WKT (0 or 1)
   */
  polygonText?: 0 | 1;
  /**
   * Polygon simplification threshold
   */
  polygonThreshold?: number;
  /**
   * JSONP callback function name
   */
  jsonCallback?: string;
  /**
   * Disable deduplication (0 or 1)
   */
  dedupe?: 0 | 1;
  /**
   * Enable debug output (0 or 1)
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

/**
 * CLI arguments for structured search command
 */
export interface StructuredArgv {
  /**
   * Name or type of POI
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
   * Email address for identification
   */
  email?: string;
  /**
   * Output format
   */
  format: OutputFormat;
  /**
   * Maximum number of results
   */
  limit?: number;
  /**
   * Postal code
   */
  postalcode?: string;
  /**
   * State name
   */
  state?: string;
  /**
   * Street name and number
   */
  street?: string;
  /**
   * Include address breakdown (0 or 1)
   */
  addressdetails?: 0 | 1;
  /**
   * Include extra tags (0 or 1)
   */
  extratags?: 0 | 1;
  /**
   * Include name details (0 or 1)
   */
  namedetails?: 0 | 1;
  /**
   * Include entrances (0 or 1)
   */
  entrances?: 0 | 1;
  /**
   * Preferred language order
   */
  acceptLanguage?: string;
  /**
   * Limit to country codes (comma-separated)
   */
  countrycodes?: string;
  /**
   * Select places by themes
   */
  layer?: string;
  /**
   * Fine-grained address layer selection
   */
  featuretype?: "country" | "state" | "city" | "settlement";
  /**
   * Exclude place IDs (comma-separated)
   */
  excludePlaceIds?: string;
  /**
   * Bounding box (x1,y1,x2,y2)
   */
  viewbox?: string;
  /**
   * Restrict to viewbox (0 or 1)
   */
  bounded?: 0 | 1;
  /**
   * Include polygon in GeoJSON (0 or 1)
   */
  polygonGeojson?: 0 | 1;
  /**
   * Include polygon in KML (0 or 1)
   */
  polygonKml?: 0 | 1;
  /**
   * Include polygon in SVG (0 or 1)
   */
  polygonSvg?: 0 | 1;
  /**
   * Include polygon in WKT (0 or 1)
   */
  polygonText?: 0 | 1;
  /**
   * Polygon simplification threshold
   */
  polygonThreshold?: number;
  /**
   * JSONP callback function name
   */
  jsonCallback?: string;
  /**
   * Disable deduplication (0 or 1)
   */
  dedupe?: 0 | 1;
  /**
   * Enable debug output (0 or 1)
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
