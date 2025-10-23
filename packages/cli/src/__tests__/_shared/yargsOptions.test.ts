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

import { describe, expect, it } from 'vitest'

import {
  amenityOption,
  cityOption,
  countryOption,
  countyOption,
  emailOption,
  outputFormatOption,
  latitudeOption,
  limitOption,
  longitudeOption,
  postalCodeOption,
  queryOption,
  stateOption,
  statusFormatOption,
  streetOption,
  noCacheOption,
  cacheTtlOption,
  cacheMaxSizeOption,
  noRateLimitOption,
  rateLimitOption,
  rateLimitIntervalOption,
  noRetryOption,
  retryMaxAttemptsOption,
  retryInitialDelayOption
} from '../../_shared/yargsOptions'

describe('yargsOptions', () => {
  describe('search options', () => {
    it('should define amenity option correctly', () => {
      expect(amenityOption).toMatchObject({
        description: 'Specify the name or type of point of interest (POI).',
        type: 'string'
      })
      expect(amenityOption.demandOption).toBeUndefined()
    })

    it('should define city option correctly', () => {
      expect(cityOption).toMatchObject({
        description: 'Specify the city name.',
        type: 'string'
      })
    })

    it('should define country option as required', () => {
      expect(countryOption).toMatchObject({
        description: 'Specify the country name.',
        type: 'string',
        demandOption: true
      })
    })

    it('should define county option correctly', () => {
      expect(countyOption).toMatchObject({
        description: 'Specify the county name.',
        type: 'string'
      })
    })

    it('should define postal code option correctly', () => {
      expect(postalCodeOption).toMatchObject({
        description: 'Specify the postal code',
        type: 'string'
      })
    })

    it('should define query option as required', () => {
      expect(queryOption).toMatchObject({
        description: 'Specify the free-form query string to search.',
        type: 'string',
        demandOption: true
      })
    })

    it('should define state option correctly', () => {
      expect(stateOption).toMatchObject({
        description: 'Specify the state name.',
        type: 'string'
      })
    })

    it('should define street option correctly', () => {
      expect(streetOption).toMatchObject({
        description: 'Specify the house number and street name',
        type: 'string'
      })
    })
  })

  describe('coordinate options', () => {
    it('should define latitude option as required string', () => {
      expect(latitudeOption).toMatchObject({
        description: 'Specify the latitude of the coordinate.',
        type: 'string',
        demandOption: true
      })
    })

    it('should define longitude option as required string', () => {
      expect(longitudeOption).toMatchObject({
        description: 'Specify the longitude of the coordinate.',
        type: 'string',
        demandOption: true
      })
    })
  })

  describe('format options', () => {
    it('should define output format option with choices', () => {
      expect(outputFormatOption).toMatchObject({
        description: 'Specify the desired output format.',
        type: 'string',
        demandOption: true
      })
      expect(outputFormatOption.choices).toEqual([
        'xml',
        'json',
        'jsonv2',
        'geojson',
        'geocodejson'
      ])
    })

    it('should define status format option with text and json choices', () => {
      expect(statusFormatOption).toMatchObject({
        description: 'Specify the desired output format.',
        type: 'string',
        demandOption: true
      })
      expect(statusFormatOption.choices).toEqual(['text', 'json'])
    })
  })

  describe('common options', () => {
    it('should define email option correctly', () => {
      expect(emailOption).toMatchObject({
        description:
          'Specify an appropriate email address when making large numbers of request.',
        type: 'string'
      })
    })

    it('should define limit option as number', () => {
      expect(limitOption).toMatchObject({
        description:
          'Specify the maximum number of returned results. Cannot be more than 40.',
        type: 'number'
      })
    })
  })

  describe('cache options', () => {
    it('should define no-cache option with boolean default', () => {
      expect(noCacheOption).toMatchObject({
        description: 'Disable response caching',
        type: 'boolean',
        default: false
      })
    })

    it('should define cache TTL option as number', () => {
      expect(cacheTtlOption).toMatchObject({
        description: 'Cache time-to-live in milliseconds',
        type: 'number'
      })
    })

    it('should define cache max size option as number', () => {
      expect(cacheMaxSizeOption).toMatchObject({
        description: 'Maximum number of cached entries',
        type: 'number'
      })
    })
  })

  describe('rate limiting options', () => {
    it('should define no-rate-limit option with boolean default', () => {
      expect(noRateLimitOption).toMatchObject({
        description: 'Disable rate limiting',
        type: 'boolean',
        default: false
      })
    })

    it('should define rate limit option as number', () => {
      expect(rateLimitOption).toMatchObject({
        description: 'Maximum number of requests per interval',
        type: 'number'
      })
    })

    it('should define rate limit interval option as number', () => {
      expect(rateLimitIntervalOption).toMatchObject({
        description: 'Time interval in milliseconds for rate limiting',
        type: 'number'
      })
    })
  })

  describe('retry options', () => {
    it('should define no-retry option with boolean default', () => {
      expect(noRetryOption).toMatchObject({
        description: 'Disable retry logic on failures',
        type: 'boolean',
        default: false
      })
    })

    it('should define retry max attempts option as number', () => {
      expect(retryMaxAttemptsOption).toMatchObject({
        description: 'Maximum number of retry attempts',
        type: 'number'
      })
    })

    it('should define retry initial delay option as number', () => {
      expect(retryInitialDelayOption).toMatchObject({
        description: 'Initial delay in milliseconds before first retry',
        type: 'number'
      })
    })
  })

  describe('option consistency', () => {
    it('should have all required options marked with demandOption', () => {
      const requiredOptions = [
        countryOption,
        outputFormatOption,
        latitudeOption,
        longitudeOption,
        queryOption,
        statusFormatOption
      ]

      requiredOptions.forEach((option) => {
        expect(option.demandOption).toBe(true)
      })
    })

    it('should have all boolean flags with default values', () => {
      expect(noCacheOption.default).toBe(false)
      expect(noRateLimitOption.default).toBe(false)
      expect(noRetryOption.default).toBe(false)
    })

    it('should have all format options with choices array', () => {
      expect(outputFormatOption.choices).toBeDefined()
      expect(Array.isArray(outputFormatOption.choices)).toBe(true)
      expect(statusFormatOption.choices).toBeDefined()
      expect(Array.isArray(statusFormatOption.choices)).toBe(true)
    })
  })
})
