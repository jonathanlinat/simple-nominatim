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

import { expectTypeOf } from "vitest";

import type { OutputFormat } from "@simple-nominatim/core";

import type { GeocodeReverseArgv } from "../../reverse/reverse.types";

expectTypeOf<GeocodeReverseArgv>().toMatchTypeOf<{
  email?: string;
  format: OutputFormat;
  latitude: string;
  longitude: string;
}>();

expectTypeOf<GeocodeReverseArgv>()
  .toHaveProperty("format")
  .toEqualTypeOf<OutputFormat>();
expectTypeOf<GeocodeReverseArgv>()
  .toHaveProperty("latitude")
  .toEqualTypeOf<string>();
expectTypeOf<GeocodeReverseArgv>()
  .toHaveProperty("longitude")
  .toEqualTypeOf<string>();
expectTypeOf<GeocodeReverseArgv>()
  .toHaveProperty("email")
  .toEqualTypeOf<string | undefined>();

const reverseArgs: GeocodeReverseArgv = {
  latitude: "48.8584",
  longitude: "2.2945",
  format: "json",
  email: "test@example.com",
};
expectTypeOf(reverseArgs).toEqualTypeOf<GeocodeReverseArgv>();
