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

import type { OutputFormat } from "@simple-nominatim/core";
import { expectTypeOf } from "vitest";

import type { GeocodeReverseArgv } from "../../reverse/reverse.types";

expectTypeOf<GeocodeReverseArgv>().toMatchObjectType<{
  latitude: string;
  longitude: string;
  format: OutputFormat;
  email?: string;
  addressdetails?: 0 | 1;
  extratags?: 0 | 1;
  namedetails?: 0 | 1;
  entrances?: 0 | 1;
  acceptLanguage?: string;
  zoom?: number;
  layer?: string;
  polygonGeojson?: 0 | 1;
  polygonKml?: 0 | 1;
  polygonSvg?: 0 | 1;
  polygonText?: 0 | 1;
  polygonThreshold?: number;
  jsonCallback?: string;
  debug?: 0 | 1;
  noCache?: boolean;
  cacheTtl?: number;
  cacheMaxSize?: number;
  noRateLimit?: boolean;
  rateLimit?: number;
  rateLimitInterval?: number;
  noRetry?: boolean;
  retryMaxAttempts?: number;
  retryInitialDelay?: number;
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
expectTypeOf<GeocodeReverseArgv>()
  .toHaveProperty("addressdetails")
  .toEqualTypeOf<0 | 1 | undefined>();
expectTypeOf<GeocodeReverseArgv>()
  .toHaveProperty("zoom")
  .toEqualTypeOf<number | undefined>();

const reverseArgs: GeocodeReverseArgv = {
  latitude: "48.8584",
  longitude: "2.2945",
  format: "json",
  email: "test@example.com",
  addressdetails: 1,
  zoom: 18,
};

expectTypeOf(reverseArgs).toEqualTypeOf<GeocodeReverseArgv>();
