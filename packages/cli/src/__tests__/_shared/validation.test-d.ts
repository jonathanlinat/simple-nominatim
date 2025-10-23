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

import { expectTypeOf } from "vitest";

import type { OutputFormat, StatusFormat } from "@simple-nominatim/core";

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
  handleValidationError,
} from "../../_shared/validation";

import type { z } from "zod";

/**
 * Test Zod validation schemas
 */
type InferredOutputFormat = z.infer<typeof outputFormatSchema>;
expectTypeOf<InferredOutputFormat>().toEqualTypeOf<OutputFormat>();

type InferredStatusFormat = z.infer<typeof statusFormatSchema>;
expectTypeOf<InferredStatusFormat>().toEqualTypeOf<StatusFormat>();

type InferredLatitude = z.infer<typeof latitudeSchema>;
expectTypeOf<InferredLatitude>().toEqualTypeOf<string>();

type InferredLongitude = z.infer<typeof longitudeSchema>;
expectTypeOf<InferredLongitude>().toEqualTypeOf<string>();

type InferredEmail = z.infer<typeof emailSchema>;
expectTypeOf<InferredEmail>().toEqualTypeOf<string | undefined>();

type InferredLimit = z.infer<typeof limitSchema>;
expectTypeOf<InferredLimit>().toEqualTypeOf<number | undefined>();

type InferredFreeFormSearch = z.infer<typeof freeFormSearchSchema>;
expectTypeOf<InferredFreeFormSearch>().toMatchTypeOf<{
  query: string;
  outputFormat: OutputFormat;
  email?: string | undefined;
  limit?: number | undefined;
}>();

type InferredStructuredSearch = z.infer<typeof structuredSearchSchema>;
expectTypeOf<InferredStructuredSearch>().toMatchTypeOf<{
  country: string;
  outputFormat: OutputFormat;
  amenity?: string | undefined;
  city?: string | undefined;
  county?: string | undefined;
  email?: string | undefined;
  limit?: number | undefined;
  postalcode?: string | undefined;
  state?: string | undefined;
  street?: string | undefined;
}>();

type InferredReverseGeocode = z.infer<typeof reverseGeocodeSchema>;
expectTypeOf<InferredReverseGeocode>().toMatchTypeOf<{
  latitude: string;
  longitude: string;
  outputFormat: OutputFormat;
  email?: string | undefined;
}>();

type InferredServiceStatus = z.infer<typeof serviceStatusSchema>;
expectTypeOf<InferredServiceStatus>().toMatchTypeOf<{
  statusFormat: StatusFormat;
}>();

/**
 * Test safeValidateArgs helper function
 */
expectTypeOf(safeValidateArgs).toBeFunction();
expectTypeOf(safeValidateArgs).parameter(0).toMatchTypeOf<z.ZodSchema>();
expectTypeOf(safeValidateArgs).parameter(1).toBeUnknown();

const validResult = safeValidateArgs(freeFormSearchSchema, {
  query: "test",
  outputFormat: "json",
});
expectTypeOf(validResult).toEqualTypeOf<
  | { success: true; data: z.infer<typeof freeFormSearchSchema> }
  | { success: false; error: z.ZodError }
>();

/**
 * Test handleValidationError function
 */
expectTypeOf(handleValidationError).toBeFunction();
expectTypeOf(handleValidationError).parameter(0).toMatchTypeOf<z.ZodError>();
expectTypeOf(handleValidationError).returns.toBeNever();
