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

import type { Options } from 'yargs'

/**
 * Yargs option for amenity parameter
 *
 * Specifies the name or type of point of interest (POI) for structured search
 */
export const amenityOption: Options = {
  description: 'Specify the name or type of point of interest (POI).',
  type: 'string'
}

/**
 * Yargs option for city parameter
 *
 * Specifies the city name for structured search
 */
export const cityOption: Options = {
  description: 'Specify the city name.',
  type: 'string'
}

/**
 * Yargs option for country parameter
 *
 * Specifies the country name for structured search (required)
 */
export const countryOption: Options = {
  description: 'Specify the country name.',
  type: 'string',
  demandOption: true
}

/**
 * Yargs option for county parameter
 *
 * Specifies the county name for structured search
 */
export const countyOption: Options = {
  description: 'Specify the county name.',
  type: 'string'
}

/**
 * Yargs option for email parameter
 *
 * Email address for identification when making large numbers of requests
 */
export const emailOption: Options = {
  description:
    'Specify an appropriate email address when making large numbers of request.',
  type: 'string'
}

/**
 * Yargs option for output format parameter
 *
 * Specifies the desired output format (xml, json, jsonv2, geojson, geocodejson) - required
 */
export const outputFormatOption: Options = {
  description: 'Specify the desired output format.',
  type: 'string',
  choices: ['xml', 'json', 'jsonv2', 'geojson', 'geocodejson'],
  demandOption: true
}

/**
 * Yargs option for latitude parameter
 *
 * Specifies the latitude coordinate for reverse geocoding (required)
 */
export const latitudeOption: Options = {
  description: 'Specify the latitude of the coordinate.',
  type: 'string',
  demandOption: true
}

/**
 * Yargs option for limit parameter
 *
 * Specifies the maximum number of returned results (max 40)
 */
export const limitOption: Options = {
  description:
    'Specify the maximum number of returned results. Cannot be more than 40.',
  type: 'number'
}

/**
 * Yargs option for longitude parameter
 *
 * Specifies the longitude coordinate for reverse geocoding (required)
 */
export const longitudeOption: Options = {
  description: 'Specify the longitude of the coordinate.',
  type: 'string',
  demandOption: true
}

/**
 * Yargs option for postal code parameter
 *
 * Specifies the postal code for structured search
 */
export const postalCodeOption: Options = {
  description: 'Specify the postal code',
  type: 'string'
}

/**
 * Yargs option for query parameter
 *
 * Specifies the free-form query string for search (required)
 */
export const queryOption: Options = {
  description: 'Specify the free-form query string to search.',
  type: 'string',
  demandOption: true
}

/**
 * Yargs option for state parameter
 *
 * Specifies the state name for structured search
 */
export const stateOption: Options = {
  description: 'Specify the state name.',
  type: 'string'
}

/**
 * Yargs option for status format parameter
 *
 * Specifies the desired output format for status endpoint (text or json) - required
 */
export const statusFormatOption: Options = {
  description: 'Specify the desired output format.',
  type: 'string',
  choices: ['text', 'json'],
  demandOption: true
}

/**
 * Yargs option for street parameter
 *
 * Specifies the house number and street name for structured search
 */
export const streetOption: Options = {
  description: 'Specify the house number and street name',
  type: 'string'
}

/**
 * Yargs option to disable caching
 *
 * When set, disables response caching
 */
export const noCacheOption: Options = {
  description: 'Disable response caching',
  type: 'boolean',
  default: false
}

/**
 * Yargs option for cache TTL
 *
 * Specifies cache time-to-live in milliseconds
 */
export const cacheTtlOption: Options = {
  description: 'Cache time-to-live in milliseconds',
  type: 'number'
}

/**
 * Yargs option for cache max size
 *
 * Specifies maximum number of cached entries
 */
export const cacheMaxSizeOption: Options = {
  description: 'Maximum number of cached entries',
  type: 'number'
}

/**
 * Yargs option to disable rate limiting
 *
 * When set, disables rate limiting
 */
export const noRateLimitOption: Options = {
  description: 'Disable rate limiting',
  type: 'boolean',
  default: false
}

/**
 * Yargs option for rate limit requests per interval
 *
 * Specifies maximum number of requests per interval
 */
export const rateLimitOption: Options = {
  description: 'Maximum number of requests per interval',
  type: 'number'
}

/**
 * Yargs option for rate limit interval
 *
 * Specifies time interval in milliseconds for rate limiting
 */
export const rateLimitIntervalOption: Options = {
  description: 'Time interval in milliseconds for rate limiting',
  type: 'number'
}

/**
 * Yargs option to disable retry logic
 *
 * When set, disables retry on failures
 */
export const noRetryOption: Options = {
  description: 'Disable retry logic on failures',
  type: 'boolean',
  default: false
}

/**
 * Yargs option for retry max attempts
 *
 * Specifies maximum number of retry attempts
 */
export const retryMaxAttemptsOption: Options = {
  description: 'Maximum number of retry attempts',
  type: 'number'
}

/**
 * Yargs option for retry initial delay
 *
 * Specifies initial delay in milliseconds before first retry
 */
export const retryInitialDelayOption: Options = {
  description: 'Initial delay in milliseconds before first retry',
  type: 'number'
}
