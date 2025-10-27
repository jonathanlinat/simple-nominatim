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

import type { CacheConfig } from "./cacheManager";
import type { RateLimitConfig } from "./rateLimiter";

/**
 * Retry configuration for failed requests
 */
export interface RetryConfig {
  /**
   * Enable or disable retry logic
   * @default true
   */
  enabled?: boolean;
  /**
   * Maximum number of retry attempts
   * @default 3
   */
  maxAttempts?: number;
  /**
   * Initial delay in milliseconds before first retry
   * @default 1000
   */
  initialDelay?: number;
  /**
   * Maximum delay between retries in milliseconds
   * @default 10000 (10 seconds)
   */
  maxDelay?: number;
  /**
   * Multiplier for exponential backoff
   * @default 2
   */
  backoffMultiplier?: number;
  /**
   * Whether to add random jitter to delays
   * @default true
   */
  useJitter?: boolean;
  /**
   * HTTP status codes that should trigger a retry
   * @default [408, 429, 500, 502, 503, 504]
   */
  retryableStatusCodes?: number[];
}

/**
 * Output format types supported by Nominatim API
 */
export type OutputFormat =
  | "xml"
  | "json"
  | "jsonv2"
  | "geojson"
  | "geocodejson";

/**
 * Common options for search and reverse geocoding requests
 */
export interface BaseOptions {
  /**
   * Email address for identification when making large numbers of requests
   */
  email?: string;
  /**
   * Output format for the response
   */
  format: OutputFormat;
  /**
   * Cache configuration for response caching (optional)
   */
  cache?: CacheConfig;
  /**
   * Rate limiter configuration for request throttling (optional)
   */
  rateLimit?: RateLimitConfig;
  /**
   * Retry configuration for failed requests (optional)
   */
  retry?: RetryConfig;
  /**
   * Include a breakdown of the address into elements (0 or 1)
   * @default 0 for Search, 1 for Reverse
   */
  addressdetails?: 0 | 1;
  /**
   * Include additional information available in the database (0 or 1)
   * @default 0
   */
  extratags?: 0 | 1;
  /**
   * Include a full list of names for the result (0 or 1)
   * @default 0
   */
  namedetails?: 0 | 1;
  /**
   * Preferred language order for showing results
   * Can be a simple comma-separated list of language codes or Accept-Language HTTP header format
   */
  "accept-language"?: string;
  /**
   * Output assorted developer debug information (0 or 1)
   * @default 0
   */
  debug?: 0 | 1;
  /**
   * Include the tagged entrances in the result (0 or 1)
   * @default 0
   */
  entrances?: 0 | 1;
  /**
   * Select places by themes (comma-separated list)
   * Options: address, poi, railway, natural, manmade
   */
  layer?: string;
  /**
   * Include full geometry in GeoJSON format (0 or 1)
   * @default 0
   */
  polygon_geojson?: 0 | 1;
  /**
   * Include full geometry in KML format (0 or 1)
   * @default 0
   */
  polygon_kml?: 0 | 1;
  /**
   * Include full geometry in SVG format (0 or 1)
   * @default 0
   */
  polygon_svg?: 0 | 1;
  /**
   * Include full geometry in WKT format (0 or 1)
   * @default 0
   */
  polygon_text?: 0 | 1;
  /**
   * Tolerance in degrees for simplified geometry output
   * @default 0.0
   */
  polygon_threshold?: number;
  /**
   * JSONP callback function name
   */
  json_callback?: string;
  /**
   * Index signature for additional query parameters
   */
  [key: string]:
    | string
    | number
    | CacheConfig
    | RateLimitConfig
    | RetryConfig
    | undefined;
}

/**
 * Options specific to search requests
 *
 * Search queries support two modes (mutually exclusive):
 * - Free-form: Use `freeFormSearch()` with a single query string
 * - Structured: Use `structuredSearch()` with address components
 *
 * Default values:
 * - `format`: defaults to 'jsonv2' (vs 'xml' for Reverse)
 * - `addressdetails`: defaults to 0 (vs 1 for Reverse)
 *
 * @see {@link https://nominatim.org/release-docs/develop/api/Search/ | Nominatim Search API}
 */
export interface SearchOptions extends BaseOptions {
  /**
   * Maximum number of returned results
   * Cannot be more than 40. Nominatim may return fewer results if additional
   * results don't sufficiently match the query.
   * @default 10
   */
  limit?: number;
  /**
   * Limit search results to one or more countries (comma-separated ISO 3166-1alpha2 codes)
   * Example: 'gb' or 'gb,de'
   */
  countrycodes?: string;
  /**
   * Fine-grained selection for places from the address layer
   * Options: country, state, city, settlement
   */
  featureType?: "country" | "state" | "city" | "settlement";
  /**
   * Comma-separated list of place_ids to skip in results
   */
  exclude_place_ids?: string;
  /**
   * Bounding box to focus the search (format: x1,y1,x2,y2 where x is longitude, y is latitude)
   */
  viewbox?: string;
  /**
   * When set to 1, restrict results to viewbox area only (0 or 1)
   * @default 0
   */
  bounded?: 0 | 1;
  /**
   * Disable deduplication of results (0 or 1)
   * @default 1
   */
  dedupe?: 0 | 1;
}

/**
 * Options specific to reverse geocoding requests
 *
 * Reverse geocoding returns exactly one result or an error when coordinates
 * are in an area with no OSM data coverage.
 *
 * Default values differ from Search API:
 * - `format`: defaults to 'xml' (vs 'jsonv2' for Search)
 * - `addressdetails`: defaults to 1 (vs 0 for Search)
 *
 * @see {@link https://nominatim.org/release-docs/develop/api/Reverse/ | Nominatim Reverse API}
 */
export interface ReverseOptions extends BaseOptions {
  /**
   * Level of detail required for the address (0-18)
   * Corresponds roughly to zoom level used in XYZ tile sources
   * @default 18
   *
   * Zoom levels:
   * - 3: country
   * - 5: state
   * - 8: county
   * - 10: city
   * - 12: town / borough
   * - 13: village / suburb
   * - 14: neighbourhood
   * - 15: any settlement
   * - 16: major streets
   * - 17: major and minor streets
   * - 18: building
   */
  zoom?: number;
}

/**
 * Options for data fetching with caching, rate limiting, and retries
 */
export interface DataFetcherOptions {
  /**
   * Cache configuration for response caching
   */
  cache?: CacheConfig;
  /**
   * Rate limiter configuration for request throttling
   */
  rateLimit?: RateLimitConfig;
  /**
   * Retry configuration for failed requests
   */
  retry?: RetryConfig;
}
