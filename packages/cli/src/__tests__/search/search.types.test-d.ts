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

import type { OutputFormat } from "@simple-nominatim/core";

import type { FreeFormArgv, StructuredArgv } from "../../search/search.types";

/**
 * Test FreeFormArgv interface
 */
expectTypeOf<FreeFormArgv>().toMatchTypeOf<{
  email?: string;
  format: OutputFormat;
  limit?: number;
  query: string;
}>();

expectTypeOf<FreeFormArgv>()
  .toHaveProperty("format")
  .toEqualTypeOf<OutputFormat>();
expectTypeOf<FreeFormArgv>().toHaveProperty("query").toEqualTypeOf<string>();
expectTypeOf<FreeFormArgv>()
  .toHaveProperty("limit")
  .toEqualTypeOf<number | undefined>();
expectTypeOf<FreeFormArgv>()
  .toHaveProperty("email")
  .toEqualTypeOf<string | undefined>();

/**
 * Test StructuredArgv interface
 */
expectTypeOf<StructuredArgv>().toMatchTypeOf<{
  amenity?: string;
  city?: string;
  country?: string;
  county?: string;
  email?: string;
  format: OutputFormat;
  limit?: number;
  postalcode?: string;
  state?: string;
  street?: string;
}>();

expectTypeOf<StructuredArgv>()
  .toHaveProperty("format")
  .toEqualTypeOf<OutputFormat>();
expectTypeOf<StructuredArgv>()
  .toHaveProperty("amenity")
  .toEqualTypeOf<string | undefined>();
expectTypeOf<StructuredArgv>()
  .toHaveProperty("city")
  .toEqualTypeOf<string | undefined>();
expectTypeOf<StructuredArgv>()
  .toHaveProperty("country")
  .toEqualTypeOf<string | undefined>();
expectTypeOf<StructuredArgv>()
  .toHaveProperty("county")
  .toEqualTypeOf<string | undefined>();
expectTypeOf<StructuredArgv>()
  .toHaveProperty("email")
  .toEqualTypeOf<string | undefined>();
expectTypeOf<StructuredArgv>()
  .toHaveProperty("limit")
  .toEqualTypeOf<number | undefined>();
expectTypeOf<StructuredArgv>()
  .toHaveProperty("postalcode")
  .toEqualTypeOf<string | undefined>();
expectTypeOf<StructuredArgv>()
  .toHaveProperty("state")
  .toEqualTypeOf<string | undefined>();
expectTypeOf<StructuredArgv>()
  .toHaveProperty("street")
  .toEqualTypeOf<string | undefined>();

/**
 * Test complete workflow type safety
 */
const freeFormArgs: FreeFormArgv = {
  query: "Paris",
  format: "jsonv2",
  limit: 10,
  email: "test@example.com",
};
expectTypeOf(freeFormArgs).toMatchTypeOf<FreeFormArgv>();

const structuredArgs: StructuredArgv = {
  country: "France",
  city: "Paris",
  format: "geojson",
  limit: 5,
};
expectTypeOf(structuredArgs).toMatchTypeOf<StructuredArgv>();
