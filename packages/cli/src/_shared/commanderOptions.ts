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
 * Specifies the country name for structured search
 */
export const countryOption = new Option(
  "--country <country>",
  "Specify the country name.",
);

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

/**
 * Commander option for addressdetails parameter
 *
 * Include a breakdown of the address into elements (0 or 1)
 */
export const addressDetailsOption = new Option(
  "--addressdetails <addressdetails>",
  "Include a breakdown of the address into elements (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Commander option for extratags parameter
 *
 * Include additional information available in the database (0 or 1)
 */
export const extraTagsOption = new Option(
  "--extratags <extratags>",
  "Include additional information available in the database (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Commander option for namedetails parameter
 *
 * Include a full list of names for the result (0 or 1)
 */
export const nameDetailsOption = new Option(
  "--namedetails <namedetails>",
  "Include a full list of names for the result (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Commander option for entrances parameter
 *
 * Include the tagged entrances in the result (0 or 1)
 */
export const entrancesOption = new Option(
  "--entrances <entrances>",
  "Include the tagged entrances in the result (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Commander option for accept-language parameter
 *
 * Preferred language order for showing search results
 */
export const acceptLanguageOption = new Option(
  "--accept-language <acceptLanguage>",
  "Preferred language order for showing search results.",
);

/**
 * Commander option for countrycodes parameter
 *
 * Limit search results to one or more countries (comma-separated ISO 3166-1alpha2 codes)
 */
export const countryCodesOption = new Option(
  "--countrycodes <countrycodes>",
  "Limit search results to countries (comma-separated ISO codes, e.g., 'gb,de').",
);

/**
 * Commander option for layer parameter
 *
 * Select places by themes
 */
export const layerOption = new Option(
  "--layer <layer>",
  "Select places by themes (comma-separated: address, poi, railway, natural, manmade).",
);

/**
 * Commander option for featureType parameter
 *
 * Fine-grained selection for places from the address layer
 */
export const featureTypeOption = new Option(
  "--featuretype <featuretype>",
  "Fine-grained selection for places from the address layer.",
).choices(["country", "state", "city", "settlement"]);

/**
 * Commander option for exclude_place_ids parameter
 *
 * Comma-separated list of place_ids to skip in results
 */
export const excludePlaceIdsOption = new Option(
  "--exclude-place-ids <excludePlaceIds>",
  "Comma-separated list of place_ids to skip in results.",
);

/**
 * Commander option for viewbox parameter
 *
 * Bounding box to focus the search
 */
export const viewboxOption = new Option(
  "--viewbox <viewbox>",
  "Bounding box to focus the search (format: x1,y1,x2,y2).",
);

/**
 * Commander option for bounded parameter
 *
 * Restrict results to viewbox area only (0 or 1)
 */
export const boundedOption = new Option(
  "--bounded <bounded>",
  "Restrict results to viewbox area only (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Commander option for polygon_geojson parameter
 *
 * Include full geometry in GeoJSON format (0 or 1)
 */
export const polygonGeojsonOption = new Option(
  "--polygon-geojson <polygonGeojson>",
  "Include full geometry in GeoJSON format (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Commander option for polygon_kml parameter
 *
 * Include full geometry in KML format (0 or 1)
 */
export const polygonKmlOption = new Option(
  "--polygon-kml <polygonKml>",
  "Include full geometry in KML format (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Commander option for polygon_svg parameter
 *
 * Include full geometry in SVG format (0 or 1)
 */
export const polygonSvgOption = new Option(
  "--polygon-svg <polygonSvg>",
  "Include full geometry in SVG format (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Commander option for polygon_text parameter
 *
 * Include full geometry in WKT format (0 or 1)
 */
export const polygonTextOption = new Option(
  "--polygon-text <polygonText>",
  "Include full geometry in WKT format (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Commander option for polygon_threshold parameter
 *
 * Tolerance in degrees for simplified geometry output
 */
export const polygonThresholdOption = new Option(
  "--polygon-threshold <polygonThreshold>",
  "Tolerance in degrees for simplified geometry output.",
).argParser(parseFloat);

/**
 * Commander option for json_callback parameter
 *
 * JSONP callback function name
 */
export const jsonCallbackOption = new Option(
  "--json-callback <jsonCallback>",
  "JSONP callback function name.",
);

/**
 * Commander option for dedupe parameter
 *
 * Disable deduplication of results (0 or 1)
 */
export const dedupeOption = new Option(
  "--dedupe <dedupe>",
  "Disable deduplication of results (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Option for debug parameter
 *
 * Output assorted developer debug information (0 or 1)
 */
export const debugOption = new Option(
  "--debug <debug>",
  "Output assorted developer debug information (0 or 1).",
)
  .choices(["0", "1"])
  .argParser(parseInt);

/**
 * Option for zoom parameter
 *
 * Level of detail required for the address (0-18)
 */
export const zoomOption = new Option(
  "--zoom <zoom>",
  "Level of detail required for the address (0-18).",
).argParser(parseInt);
