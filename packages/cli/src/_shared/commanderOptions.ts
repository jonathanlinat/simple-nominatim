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

import { Option } from "commander";

/**
 * Commander option for amenity parameter
 *
 * Specifies the name or type of point of interest (POI) for structured search
 */
export const amenityOption = new Option(
  "--amenity <amenity>",
  "Specify the name or type of point of interest (POI).",
);

/**
 * Commander option for city parameter
 *
 * Specifies the city name for structured search
 */
export const cityOption = new Option("--city <city>", "Specify the city name.");

/**
 * Commander option for country parameter
 *
 * Specifies the country name for structured search (required)
 */
export const countryOption = new Option(
  "--country <country>",
  "Specify the country name.",
).makeOptionMandatory();

/**
 * Commander option for county parameter
 *
 * Specifies the county name for structured search
 */
export const countyOption = new Option(
  "--county <county>",
  "Specify the county name.",
);

/**
 * Commander option for email parameter
 *
 * Email address for identification when making large numbers of requests
 */
export const emailOption = new Option(
  "-e, --email <email>",
  "Specify an appropriate email address when making large numbers of request.",
);

/**
 * Commander option for output format parameter
 *
 * Specifies the desired output format (xml, json, jsonv2, geojson, geocodejson) - required
 */
export const outputFormatOption = new Option(
  "-f, --format <format>",
  "Specify the desired output format.",
)
  .choices(["xml", "json", "jsonv2", "geojson", "geocodejson"])
  .makeOptionMandatory();

/**
 * Commander option for latitude parameter
 *
 * Specifies the latitude coordinate for reverse geocoding (required)
 */
export const latitudeOption = new Option(
  "--latitude <latitude>",
  "Specify the latitude of the coordinate.",
).makeOptionMandatory();

/**
 * Commander option for limit parameter
 *
 * Specifies the maximum number of returned results (max 40)
 */
export const limitOption = new Option(
  "--limit <limit>",
  "Specify the maximum number of returned results. Cannot be more than 40.",
).argParser(parseInt);

/**
 * Commander option for longitude parameter
 *
 * Specifies the longitude coordinate for reverse geocoding (required)
 */
export const longitudeOption = new Option(
  "--longitude <longitude>",
  "Specify the longitude of the coordinate.",
).makeOptionMandatory();

/**
 * Commander option for postal code parameter
 *
 * Specifies the postal code for structured search
 */
export const postalCodeOption = new Option(
  "--postal-code <postalCode>",
  "Specify the postal code",
);

/**
 * Commander option for query parameter
 *
 * Specifies the free-form query string for search (required)
 */
export const queryOption = new Option(
  "-q, --query <query>",
  "Specify the free-form query string to search.",
).makeOptionMandatory();

/**
 * Commander option for state parameter
 *
 * Specifies the state name for structured search
 */
export const stateOption = new Option(
  "--state <state>",
  "Specify the state name.",
);

/**
 * Commander option for status format parameter
 *
 * Specifies the desired output format for status endpoint (text or json) - required
 */
export const statusFormatOption = new Option(
  "-f, --format <format>",
  "Specify the desired output format.",
)
  .choices(["text", "json"])
  .makeOptionMandatory();

/**
 * Commander option for street parameter
 *
 * Specifies the house number and street name for structured search
 */
export const streetOption = new Option(
  "--street <street>",
  "Specify the house number and street name",
);

/**
 * Commander option to disable caching
 *
 * When set, disables response caching
 */
export const noCacheOption = new Option(
  "--no-cache",
  "Disable response caching",
);

/**
 * Commander option for cache TTL
 *
 * Specifies cache time-to-live in milliseconds
 */
export const cacheTtlOption = new Option(
  "--cache-ttl <cacheTtl>",
  "Cache time-to-live in milliseconds",
).argParser(parseInt);

/**
 * Commander option for cache max size
 *
 * Specifies maximum number of cached entries
 */
export const cacheMaxSizeOption = new Option(
  "--cache-max-size <cacheMaxSize>",
  "Maximum number of cached entries",
).argParser(parseInt);

/**
 * Commander option to disable rate limiting
 *
 * When set, disables rate limiting
 */
export const noRateLimitOption = new Option(
  "--no-rate-limit",
  "Disable rate limiting",
);

/**
 * Commander option for rate limit requests per interval
 *
 * Specifies maximum number of requests per interval
 */
export const rateLimitOption = new Option(
  "--rate-limit <rateLimit>",
  "Maximum number of requests per interval",
).argParser(parseInt);

/**
 * Commander option for rate limit interval
 *
 * Specifies time interval in milliseconds for rate limiting
 */
export const rateLimitIntervalOption = new Option(
  "--rate-limit-interval <rateLimitInterval>",
  "Time interval in milliseconds for rate limiting",
).argParser(parseInt);

/**
 * Commander option to disable retry logic
 *
 * When set, disables retry on failures
 */
export const noRetryOption = new Option(
  "--no-retry",
  "Disable retry logic on failures",
);

/**
 * Commander option for retry max attempts
 *
 * Specifies maximum number of retry attempts
 */
export const retryMaxAttemptsOption = new Option(
  "--retry-max-attempts <retryMaxAttempts>",
  "Maximum number of retry attempts",
).argParser(parseInt);

/**
 * Commander option for retry initial delay
 *
 * Specifies initial delay in milliseconds before first retry
 */
export const retryInitialDelayOption = new Option(
  "--retry-initial-delay <retryInitialDelay>",
  "Initial delay in milliseconds before first retry",
).argParser(parseInt);
