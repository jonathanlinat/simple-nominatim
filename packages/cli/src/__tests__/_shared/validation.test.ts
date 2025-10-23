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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import {
  outputFormatSchema,
  statusFormatSchema,
  latitudeSchema,
  longitudeSchema,
  emailSchema,
  limitSchema,
  freeFormSearchSchema,
  structuredSearchSchema,
  reverseGeocodeSchema,
  serviceStatusSchema,
  safeValidateArgs,
  handleValidationError
} from '../../_shared/validation'

describe('validation schemas', () => {
  describe('outputFormatSchema', () => {
    it('should accept valid output formats', () => {
      expect(outputFormatSchema.parse('xml')).toBe('xml')
      expect(outputFormatSchema.parse('json')).toBe('json')
      expect(outputFormatSchema.parse('jsonv2')).toBe('jsonv2')
      expect(outputFormatSchema.parse('geojson')).toBe('geojson')
      expect(outputFormatSchema.parse('geocodejson')).toBe('geocodejson')
    })

    it('should reject invalid output formats', () => {
      expect(() => outputFormatSchema.parse('invalid')).toThrow()
      expect(() => outputFormatSchema.parse('text')).toThrow()
      expect(() => outputFormatSchema.parse('')).toThrow()
    })
  })

  describe('statusFormatSchema', () => {
    it('should accept valid status formats', () => {
      expect(statusFormatSchema.parse('text')).toBe('text')
      expect(statusFormatSchema.parse('json')).toBe('json')
    })

    it('should reject invalid status formats', () => {
      expect(() => statusFormatSchema.parse('xml')).toThrow()
      expect(() => statusFormatSchema.parse('invalid')).toThrow()
    })
  })

  describe('latitudeSchema', () => {
    it('should accept valid latitudes', () => {
      expect(latitudeSchema.parse('0')).toBe('0')
      expect(latitudeSchema.parse('51.5074')).toBe('51.5074')
      expect(latitudeSchema.parse('-33.8688')).toBe('-33.8688')
      expect(latitudeSchema.parse('90')).toBe('90')
      expect(latitudeSchema.parse('-90')).toBe('-90')
    })

    it('should reject out-of-range latitudes', () => {
      expect(() => latitudeSchema.parse('91')).toThrow('between -90 and 90')
      expect(() => latitudeSchema.parse('-91')).toThrow('between -90 and 90')
      expect(() => latitudeSchema.parse('100')).toThrow('between -90 and 90')
    })

    it('should reject invalid latitude formats', () => {
      expect(() => latitudeSchema.parse('abc')).toThrow('valid number')
      expect(() => latitudeSchema.parse('51.5N')).toThrow('valid number')
      expect(() => latitudeSchema.parse('')).toThrow()
    })
  })

  describe('longitudeSchema', () => {
    it('should accept valid longitudes', () => {
      expect(longitudeSchema.parse('0')).toBe('0')
      expect(longitudeSchema.parse('-0.1278')).toBe('-0.1278')
      expect(longitudeSchema.parse('139.6503')).toBe('139.6503')
      expect(longitudeSchema.parse('180')).toBe('180')
      expect(longitudeSchema.parse('-180')).toBe('-180')
    })

    it('should reject out-of-range longitudes', () => {
      expect(() => longitudeSchema.parse('181')).toThrow('between -180 and 180')
      expect(() => longitudeSchema.parse('-181')).toThrow('between -180 and 180')
      expect(() => longitudeSchema.parse('200')).toThrow('between -180 and 180')
    })

    it('should reject invalid longitude formats', () => {
      expect(() => longitudeSchema.parse('xyz')).toThrow('valid number')
      expect(() => longitudeSchema.parse('0.12W')).toThrow('valid number')
    })
  })

  describe('emailSchema', () => {
    it('should accept valid email addresses', () => {
      expect(emailSchema.parse('user@example.com')).toBe('user@example.com')
      expect(emailSchema.parse('test.user@domain.co.uk')).toBe('test.user@domain.co.uk')
    })

    it('should accept undefined for optional email', () => {
      expect(emailSchema.parse(undefined)).toBeUndefined()
    })

    it('should reject invalid email formats', () => {
      expect(() => emailSchema.parse('invalid')).toThrow('valid email')
      expect(() => emailSchema.parse('user@')).toThrow('valid email')
      expect(() => emailSchema.parse('@domain.com')).toThrow('valid email')
    })
  })

  describe('limitSchema', () => {
    it('should accept valid limits', () => {
      expect(limitSchema.parse(1)).toBe(1)
      expect(limitSchema.parse(10)).toBe(10)
      expect(limitSchema.parse(40)).toBe(40)
    })

    it('should accept undefined for optional limit', () => {
      expect(limitSchema.parse(undefined)).toBeUndefined()
    })

    it('should reject out-of-range limits', () => {
      expect(() => limitSchema.parse(0)).toThrow('at least 1')
      expect(() => limitSchema.parse(41)).toThrow('cannot exceed 40')
      expect(() => limitSchema.parse(100)).toThrow('cannot exceed 40')
    })

    it('should reject non-integer limits', () => {
      expect(() => limitSchema.parse(5.5)).toThrow('must be an integer')
      expect(() => limitSchema.parse(10.1)).toThrow('must be an integer')
    })
  })

  describe('freeFormSearchSchema', () => {
    it('should accept valid free-form search data', () => {
      const validData = {
        query: 'London',
        outputFormat: 'json',
        email: 'user@example.com',
        limit: 10
      }

      const result = freeFormSearchSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should accept minimal required fields', () => {
      const minimalData = {
        query: 'Paris',
        outputFormat: 'json'
      }

      const result = freeFormSearchSchema.parse(minimalData)
      expect(result.query).toBe('Paris')
      expect(result.outputFormat).toBe('json')
    })

    it('should reject empty query', () => {
      const invalidData = {
        query: '',
        outputFormat: 'json'
      }

      expect(() => freeFormSearchSchema.parse(invalidData)).toThrow('cannot be empty')
    })

    it('should reject missing query', () => {
      const invalidData = {
        outputFormat: 'json'
      }

      expect(() => freeFormSearchSchema.parse(invalidData)).toThrow()
    })
  })

  describe('structuredSearchSchema', () => {
    it('should accept valid structured search data', () => {
      const validData = {
        country: 'United Kingdom',
        outputFormat: 'json',
        city: 'London',
        street: '10 Downing Street',
        postalcode: 'SW1A 2AA',
        email: 'user@example.com',
        limit: 5
      }

      const result = structuredSearchSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should accept minimal required fields', () => {
      const minimalData = {
        country: 'UK',
        outputFormat: 'json'
      }

      const result = structuredSearchSchema.parse(minimalData)
      expect(result.country).toBe('UK')
    })

    it('should reject empty country', () => {
      const invalidData = {
        country: '',
        outputFormat: 'json'
      }

      expect(() => structuredSearchSchema.parse(invalidData)).toThrow('Country is required')
    })

    it('should reject missing country', () => {
      const invalidData = {
        outputFormat: 'json'
      }

      expect(() => structuredSearchSchema.parse(invalidData)).toThrow()
    })
  })

  describe('reverseGeocodeSchema', () => {
    it('should accept valid reverse geocode data', () => {
      const validData = {
        latitude: '51.5074',
        longitude: '-0.1278',
        outputFormat: 'json',
        email: 'user@example.com'
      }

      const result = reverseGeocodeSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should accept minimal required fields', () => {
      const minimalData = {
        latitude: '40.7128',
        longitude: '-74.0060',
        outputFormat: 'json'
      }

      const result = reverseGeocodeSchema.parse(minimalData)
      expect(result.latitude).toBe('40.7128')
      expect(result.longitude).toBe('-74.0060')
    })

    it('should reject invalid coordinates', () => {
      const invalidData = {
        latitude: '100',
        longitude: '-0.1278',
        outputFormat: 'json'
      }

      expect(() => reverseGeocodeSchema.parse(invalidData)).toThrow()
    })
  })

  describe('serviceStatusSchema', () => {
    it('should accept valid status format', () => {
      const validData = {
        statusFormat: 'json'
      }

      const result = serviceStatusSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should accept text format', () => {
      const validData = {
        statusFormat: 'text'
      }

      const result = serviceStatusSchema.parse(validData)
      expect(result.statusFormat).toBe('text')
    })

    it('should reject invalid format', () => {
      const invalidData = {
        statusFormat: 'xml'
      }

      expect(() => serviceStatusSchema.parse(invalidData)).toThrow()
    })
  })
})

describe('validation helpers', () => {
  describe('safeValidateArgs', () => {
    it('should return success for valid data', () => {
      const schema = z.object({ name: z.string() })
      const data = { name: 'test' }

      const result = safeValidateArgs(schema, data)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(data)
      }
    })

    it('should return error for invalid data', () => {
      const schema = z.object({ name: z.string() })
      const data = { name: 123 }

      const result = safeValidateArgs(schema, data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(z.ZodError)
      }
    })

    it('should work with complex schemas', () => {
      const schema = z.object({
        id: z.number(),
        name: z.string(),
        email: z.email()
      })
      const validData = {
        id: 1,
        name: 'John',
        email: 'john@example.com'
      }

      const result = safeValidateArgs(schema, validData)

      expect(result.success).toBe(true)
    })
  })

  describe('handleValidationError', () => {
    let consoleErrorSpy: ReturnType<typeof vi.fn>
    let processExitSpy: ReturnType<typeof vi.fn>

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called')
      })
    })

    afterEach(() => {
      consoleErrorSpy.mockRestore()
      processExitSpy.mockRestore()
    })

    it('should log validation errors', () => {
      const schema = z.object({ name: z.string() })
      const result = schema.safeParse({ name: 123 })

      if (!result.success) {
        expect(() => handleValidationError(result.error)).toThrow('process.exit called')
        expect(consoleErrorSpy).toHaveBeenCalledWith('Validation error:')
        expect(consoleErrorSpy).toHaveBeenCalled()
      }
    })

    it('should exit process with code 1', () => {
      const schema = z.object({ name: z.string() })
      const result = schema.safeParse({ name: 123 })

      if (!result.success) {
        expect(() => handleValidationError(result.error)).toThrow('process.exit called')
        expect(processExitSpy).toHaveBeenCalledWith(1)
      }
    })

    it('should format multiple errors', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
        email: z.email()
      })
      const result = schema.safeParse({
        name: 123,
        age: 'invalid',
        email: 'not-an-email'
      })

      if (!result.success) {
        expect(() => handleValidationError(result.error)).toThrow('process.exit called')
        expect(consoleErrorSpy.mock.calls.length).toBeGreaterThan(1)
      }
    })
  })
})
