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

import { z } from 'zod'

/**
 * Output format validation schema
 */
export const outputFormatSchema = z.enum([
  'xml',
  'json',
  'jsonv2',
  'geojson',
  'geocodejson'
])

/**
 * Status format validation schema
 */
export const statusFormatSchema = z.enum(['text', 'json'])

/**
 * Latitude validation schema (-90 to 90)
 */
export const latitudeSchema = z
  .string()
  .regex(/^-?\d+\.?\d*$/, 'Latitude must be a valid number')
  .refine(
    (val) => {
      const num = parseFloat(val)
      return num >= -90 && num <= 90
    },
    { message: 'Latitude must be between -90 and 90' }
  )

/**
 * Longitude validation schema (-180 to 180)
 */
export const longitudeSchema = z
  .string()
  .regex(/^-?\d+\.?\d*$/, 'Longitude must be a valid number')
  .refine(
    (val) => {
      const num = parseFloat(val)
      return num >= -180 && num <= 180
    },
    { message: 'Longitude must be between -180 and 180' }
  )

/**
 * Email validation schema (basic format)
 */
export const emailSchema = z
  .string()
  .email('Email must be a valid email address')
  .optional()

/**
 * Limit validation schema (1-40 as per Nominatim API limits)
 */
export const limitSchema = z
  .number()
  .int('Limit must be an integer')
  .min(1, 'Limit must be at least 1')
  .max(40, 'Limit cannot exceed 40 (Nominatim API limit)')
  .optional()

/**
 * Free-form search validation schema
 */
export const freeFormSearchSchema = z.object({
  query: z.string().min(1, 'Query string cannot be empty'),
  outputFormat: outputFormatSchema,
  email: emailSchema,
  limit: limitSchema
})

/**
 * Structured search validation schema
 */
export const structuredSearchSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  outputFormat: outputFormatSchema,
  amenity: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  email: emailSchema,
  limit: limitSchema,
  postalcode: z.string().optional(),
  state: z.string().optional(),
  street: z.string().optional()
})

/**
 * Reverse geocoding validation schema
 */
export const reverseGeocodeSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  outputFormat: outputFormatSchema,
  email: emailSchema
})

/**
 * Service status validation schema
 */
export const serviceStatusSchema = z.object({
  statusFormat: statusFormatSchema
})

/**
 * Helper function to safely validate arguments and return errors
 *
 * @template T - The inferred schema type
 * @param {z.ZodSchema<T>} schema The Zod schema to validate against
 * @param {unknown} data The data to validate
 * @returns {{ success: true; data: T } | { success: false; error: z.ZodError }} Validation result
 */
export const safeValidateArgs = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } => {
  const result = schema.safeParse(data)

  return result
}

/**
 * Handles validation errors by logging them to console and exiting the process
 *
 * This utility function provides consistent error handling across all CLI commands.
 * It formats Zod validation errors in a user-friendly way and terminates the process.
 *
 * @param {z.ZodError} error The Zod validation error to handle
 * @returns {never} This function never returns (exits the process)
 *
 * @internal
 */
export const handleValidationError = (error: z.ZodError): never => {
  console.error('Validation error:')

  error.issues.forEach((err) => {
    console.error(`  - ${err.path.join('.')}: ${err.message}`)
  })

  process.exit(1)
}
