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

import { geocodeReverse } from "@simple-nominatim/core";
import type {
  GeocodeReverseParams,
  ReverseOptions,
} from "@simple-nominatim/core";

import {
  buildCacheConfig,
  buildRateLimitConfig,
  buildRetryConfig,
} from "../_shared/configBuilders";
import { responseParser } from "../_shared/responseParser";
import {
  safeValidateArgs,
  reverseGeocodeSchema,
  handleValidationError,
} from "../_shared/validation";

import type { GeocodeReverseArgv } from "./reverse.types";

/**
 * Build API options from command-line arguments
 * @internal
 */
const buildApiOptions = (argv: GeocodeReverseArgv) => {
  const {
    email,
    format,
    addressdetails,
    extratags,
    namedetails,
    entrances,
    acceptLanguage,
    zoom,
    layer,
    polygonGeojson,
    polygonKml,
    polygonSvg,
    polygonText,
    polygonThreshold,
    debug,
  } = argv;

  return {
    email,
    format,
    ...(addressdetails !== undefined && { addressdetails }),
    ...(extratags !== undefined && { extratags }),
    ...(namedetails !== undefined && { namedetails }),
    ...(entrances !== undefined && { entrances }),
    ...(acceptLanguage && { "accept-language": acceptLanguage }),
    ...(zoom !== undefined && { zoom }),
    ...(layer && { layer }),
    ...(polygonGeojson !== undefined && { polygon_geojson: polygonGeojson }),
    ...(polygonKml !== undefined && { polygon_kml: polygonKml }),
    ...(polygonSvg !== undefined && { polygon_svg: polygonSvg }),
    ...(polygonText !== undefined && { polygon_text: polygonText }),
    ...(polygonThreshold !== undefined && {
      polygon_threshold: polygonThreshold,
    }),
    ...(debug !== undefined && { debug }),
  };
};

/**
 * CLI wrapper for reverse geocoding functionality
 *
 * This function wraps the core reverse geocoding functionality for use in the CLI.
 * It transforms CLI arguments with coordinates into the format expected by the
 * core library, executes the reverse geocoding, and outputs the results to the console.
 *
 * Supports optional configuration overrides for caching, rate limiting, and retry logic.
 * When no configuration flags are provided, sensible defaults are applied automatically.
 *
 * @param {GeocodeReverseArgv} argv Command-line arguments from Commander containing coordinates and optional configuration
 * @param {string} argv.latitude Latitude coordinate (required)
 * @param {string} argv.longitude Longitude coordinate (required)
 * @param {string} [argv.email] Email address for identification when making large numbers of requests
 * @param {OutputFormat} argv.format Output format (required)
 * @param {0|1} [argv.addressdetails] Include a breakdown of the address into elements
 * @param {0|1} [argv.extratags] Include additional information available in the database
 * @param {0|1} [argv.namedetails] Include a full list of names for the result
 * @param {0|1} [argv.entrances] Include the tagged entrances in the result
 * @param {string} [argv.acceptLanguage] Preferred language order for showing results
 * @param {number} [argv.zoom] Level of detail required for the address (0-18)
 * @param {string} [argv.layer] Select places by themes (comma-separated list)
 * @param {0|1} [argv.polygonGeojson] Include full geometry in GeoJSON format
 * @param {0|1} [argv.polygonKml] Include full geometry in KML format
 * @param {0|1} [argv.polygonSvg] Include full geometry in SVG format
 * @param {0|1} [argv.polygonText] Include full geometry in WKT format
 * @param {number} [argv.polygonThreshold] Tolerance in degrees for simplified geometry output
 * @param {string} [argv.jsonCallback] JSONP callback function name
 * @param {0|1} [argv.debug] Output assorted developer debug information
 * @param {boolean} [argv.noCache] Disable response caching
 * @param {number} [argv.cacheTtl] Cache time-to-live in milliseconds
 * @param {number} [argv.cacheMaxSize] Maximum number of cached entries
 * @param {boolean} [argv.noRateLimit] Disable rate limiting
 * @param {number} [argv.rateLimit] Maximum number of requests per interval
 * @param {number} [argv.rateLimitInterval] Time interval in milliseconds for rate limiting
 * @param {boolean} [argv.noRetry] Disable retry logic on failures
 * @param {number} [argv.retryMaxAttempts] Maximum number of retry attempts
 * @param {number} [argv.retryInitialDelay] Initial delay in milliseconds before first retry
 * @returns {Promise<void>} A promise that resolves when the reverse geocoding is complete
 *
 * @internal
 */
export const geocodeReverseWrapper = (
  argv: GeocodeReverseArgv,
): Promise<void> => {
  const { latitude, longitude, email, format } = argv;

  const validationResult = safeValidateArgs(reverseGeocodeSchema, {
    latitude,
    longitude,
    outputFormat: format,
    email,
  });

  if (!validationResult.success) {
    handleValidationError(validationResult.error);
  }

  const params: GeocodeReverseParams = { latitude, longitude };
  const apiOptions = buildApiOptions(argv);
  const cacheConfig = buildCacheConfig(argv);
  const rateLimitConfig = buildRateLimitConfig(argv);
  const retryConfig = buildRetryConfig(argv);

  const options: ReverseOptions = {
    ...apiOptions,
    ...(cacheConfig && { cache: cacheConfig }),
    ...(rateLimitConfig && { rateLimit: rateLimitConfig }),
    ...(retryConfig && { retry: retryConfig }),
  };

  const response = geocodeReverse(params, options);

  return responseParser(response);
};
