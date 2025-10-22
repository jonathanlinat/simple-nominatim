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

import { expectTypeOf } from 'expect-type'
import type { z } from 'zod'
import type { OutputFormat, StatusFormat } from '@simple-nominatim/core'
import type { GeocodeReverseArgv } from '../reverse/reverse.types'
import type { FreeFormArgv, StructuredArgv } from '../search/search.types'
import type { ServiceStatusArgv } from '../status/status.types'
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
} from '../_shared/validation'
import { geocodeReverseWrapper } from '../reverse/geocode'
import { freeFormSearchWrapper } from '../search/free-form'
import { structuredSearchWrapper } from '../search/structured'
import { serviceStatusWrapper } from '../status/service'
import { responseParser } from '../_shared/responseParser'

/**
 * Test GeocodeReverseArgv interface
 */
expectTypeOf<GeocodeReverseArgv>().toMatchTypeOf<{
  email?: string
  format: OutputFormat
  latitude: string
  longitude: string
}>()

expectTypeOf<GeocodeReverseArgv>().toHaveProperty('format').toEqualTypeOf<OutputFormat>()
expectTypeOf<GeocodeReverseArgv>().toHaveProperty('latitude').toEqualTypeOf<string>()
expectTypeOf<GeocodeReverseArgv>().toHaveProperty('longitude').toEqualTypeOf<string>()
expectTypeOf<GeocodeReverseArgv>().toHaveProperty('email').toEqualTypeOf<string | undefined>()

/**
 * Test FreeFormArgv interface
 */
expectTypeOf<FreeFormArgv>().toMatchTypeOf<{
  email?: string
  format: OutputFormat
  limit?: number
  query: string
}>()

expectTypeOf<FreeFormArgv>().toHaveProperty('format').toEqualTypeOf<OutputFormat>()
expectTypeOf<FreeFormArgv>().toHaveProperty('query').toEqualTypeOf<string>()
expectTypeOf<FreeFormArgv>().toHaveProperty('limit').toEqualTypeOf<number | undefined>()
expectTypeOf<FreeFormArgv>().toHaveProperty('email').toEqualTypeOf<string | undefined>()

/**
 * Test StructuredArgv interface
 */
expectTypeOf<StructuredArgv>().toMatchTypeOf<{
  amenity?: string
  city?: string
  country?: string
  county?: string
  email?: string
  format: OutputFormat
  limit?: number
  postalcode?: string
  state?: string
  street?: string
}>()

expectTypeOf<StructuredArgv>().toHaveProperty('format').toEqualTypeOf<OutputFormat>()
expectTypeOf<StructuredArgv>().toHaveProperty('amenity').toEqualTypeOf<string | undefined>()
expectTypeOf<StructuredArgv>().toHaveProperty('city').toEqualTypeOf<string | undefined>()
expectTypeOf<StructuredArgv>().toHaveProperty('country').toEqualTypeOf<string | undefined>()
expectTypeOf<StructuredArgv>().toHaveProperty('county').toEqualTypeOf<string | undefined>()
expectTypeOf<StructuredArgv>().toHaveProperty('email').toEqualTypeOf<string | undefined>()
expectTypeOf<StructuredArgv>().toHaveProperty('limit').toEqualTypeOf<number | undefined>()
expectTypeOf<StructuredArgv>().toHaveProperty('postalcode').toEqualTypeOf<string | undefined>()
expectTypeOf<StructuredArgv>().toHaveProperty('state').toEqualTypeOf<string | undefined>()
expectTypeOf<StructuredArgv>().toHaveProperty('street').toEqualTypeOf<string | undefined>()

/**
 * Test ServiceStatusArgv interface
 */
expectTypeOf<ServiceStatusArgv>().toMatchTypeOf<{
  format: StatusFormat
}>()

expectTypeOf<ServiceStatusArgv>().toHaveProperty('format').toEqualTypeOf<StatusFormat>()

/**
 * Test Zod validation schemas
 */

// outputFormatSchema should infer to OutputFormat type
type InferredOutputFormat = z.infer<typeof outputFormatSchema>
expectTypeOf<InferredOutputFormat>().toEqualTypeOf<OutputFormat>()

// statusFormatSchema should infer to StatusFormat type
type InferredStatusFormat = z.infer<typeof statusFormatSchema>
expectTypeOf<InferredStatusFormat>().toEqualTypeOf<StatusFormat>()

// latitudeSchema should infer to string
type InferredLatitude = z.infer<typeof latitudeSchema>
expectTypeOf<InferredLatitude>().toEqualTypeOf<string>()

// longitudeSchema should infer to string
type InferredLongitude = z.infer<typeof longitudeSchema>
expectTypeOf<InferredLongitude>().toEqualTypeOf<string>()

// emailSchema should infer to string | undefined
type InferredEmail = z.infer<typeof emailSchema>
expectTypeOf<InferredEmail>().toEqualTypeOf<string | undefined>()

// limitSchema should infer to number | undefined
type InferredLimit = z.infer<typeof limitSchema>
expectTypeOf<InferredLimit>().toEqualTypeOf<number | undefined>()

// freeFormSearchSchema should have correct structure
type InferredFreeFormSearch = z.infer<typeof freeFormSearchSchema>
expectTypeOf<InferredFreeFormSearch>().toMatchTypeOf<{
  query: string
  outputFormat: OutputFormat
  email?: string | undefined
  limit?: number | undefined
}>()

// structuredSearchSchema should have correct structure
type InferredStructuredSearch = z.infer<typeof structuredSearchSchema>
expectTypeOf<InferredStructuredSearch>().toMatchTypeOf<{
  country: string
  outputFormat: OutputFormat
  amenity?: string | undefined
  city?: string | undefined
  county?: string | undefined
  email?: string | undefined
  limit?: number | undefined
  postalcode?: string | undefined
  state?: string | undefined
  street?: string | undefined
}>()

// reverseGeocodeSchema should have correct structure
type InferredReverseGeocode = z.infer<typeof reverseGeocodeSchema>
expectTypeOf<InferredReverseGeocode>().toMatchTypeOf<{
  latitude: string
  longitude: string
  outputFormat: OutputFormat
  email?: string | undefined
}>()

// serviceStatusSchema should have correct structure
type InferredServiceStatus = z.infer<typeof serviceStatusSchema>
expectTypeOf<InferredServiceStatus>().toMatchTypeOf<{
  statusFormat: StatusFormat
}>()

/**
 * Test safeValidateArgs helper function
 */
expectTypeOf(safeValidateArgs).toBeFunction()
expectTypeOf(safeValidateArgs).parameter(0).toMatchTypeOf<z.ZodSchema>()
expectTypeOf(safeValidateArgs).parameter(1).toBeUnknown()

// Test return type for successful validation
const validResult = safeValidateArgs(freeFormSearchSchema, {
  query: 'test',
  outputFormat: 'json'
})
expectTypeOf(validResult).toEqualTypeOf<
  | { success: true; data: z.infer<typeof freeFormSearchSchema> }
  | { success: false; error: z.ZodError }
>()

/**
 * Test wrapper functions signatures
 */

// geocodeReverseWrapper
expectTypeOf(geocodeReverseWrapper).toBeFunction()
expectTypeOf(geocodeReverseWrapper).parameter(0).toMatchTypeOf<GeocodeReverseArgv>()
expectTypeOf(geocodeReverseWrapper).returns.resolves.toBeVoid()

// freeFormSearchWrapper
expectTypeOf(freeFormSearchWrapper).toBeFunction()
expectTypeOf(freeFormSearchWrapper).parameter(0).toMatchTypeOf<FreeFormArgv>()
expectTypeOf(freeFormSearchWrapper).returns.resolves.toBeVoid()

// structuredSearchWrapper
expectTypeOf(structuredSearchWrapper).toBeFunction()
expectTypeOf(structuredSearchWrapper).parameter(0).toMatchTypeOf<StructuredArgv>()
expectTypeOf(structuredSearchWrapper).returns.resolves.toBeVoid()

// serviceStatusWrapper
expectTypeOf(serviceStatusWrapper).toBeFunction()
expectTypeOf(serviceStatusWrapper).parameter(0).toMatchTypeOf<ServiceStatusArgv>()
expectTypeOf(serviceStatusWrapper).returns.resolves.toBeVoid()

/**
 * Test responseParser function
 */
expectTypeOf(responseParser).toBeFunction()
expectTypeOf(responseParser).parameter(0).toMatchTypeOf<Promise<unknown>>()
expectTypeOf(responseParser).returns.resolves.toBeVoid()

// Test with specific type
interface TestResponse {
  data: string
}
const testPromise: Promise<TestResponse> = Promise.resolve({ data: 'test' })
const parsedResponse = responseParser(testPromise)
expectTypeOf(parsedResponse).toEqualTypeOf<Promise<void>>()

/**
 * Test handleValidationError function
 */
expectTypeOf(handleValidationError).toBeFunction()
expectTypeOf(handleValidationError).parameter(0).toMatchTypeOf<z.ZodError>()
expectTypeOf(handleValidationError).returns.toBeNever()

/**
 * Test complete workflow type safety
 */

// Valid GeocodeReverseArgv object
const reverseArgs: GeocodeReverseArgv = {
  latitude: '48.8584',
  longitude: '2.2945',
  format: 'json',
  email: 'test@example.com'
}
expectTypeOf(reverseArgs).toMatchTypeOf<GeocodeReverseArgv>()

// Valid FreeFormArgv object
const freeFormArgs: FreeFormArgv = {
  query: 'Paris',
  format: 'jsonv2',
  limit: 10,
  email: 'test@example.com'
}
expectTypeOf(freeFormArgs).toMatchTypeOf<FreeFormArgv>()

// Valid StructuredArgv object
const structuredArgs: StructuredArgv = {
  country: 'France',
  city: 'Paris',
  format: 'geojson',
  limit: 5
}
expectTypeOf(structuredArgs).toMatchTypeOf<StructuredArgv>()

// Valid ServiceStatusArgv object
const statusArgs: ServiceStatusArgv = {
  format: 'json'
}
expectTypeOf(statusArgs).toMatchTypeOf<ServiceStatusArgv>()
