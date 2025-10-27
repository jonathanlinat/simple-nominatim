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

import { geocodeReverseWrapper } from "../reverse/geocode";
import { freeFormSearchWrapper } from "../search/free-form";
import { structuredSearchWrapper } from "../search/structured";
import { serviceStatusWrapper } from "../status/service";

import type { GeocodeReverseArgv } from "../reverse/reverse.types";
import type { FreeFormArgv, StructuredArgv } from "../search/search.types";
import type { ServiceStatusArgv } from "../status/status.types";

expectTypeOf(geocodeReverseWrapper).toBeFunction();
expectTypeOf(geocodeReverseWrapper)
  .parameter(0)
  .toEqualTypeOf<GeocodeReverseArgv>();
expectTypeOf(geocodeReverseWrapper).returns.resolves.toBeVoid();

expectTypeOf(freeFormSearchWrapper).toBeFunction();
expectTypeOf(freeFormSearchWrapper).parameter(0).toEqualTypeOf<FreeFormArgv>();
expectTypeOf(freeFormSearchWrapper).returns.resolves.toBeVoid();

expectTypeOf(structuredSearchWrapper).toBeFunction();
expectTypeOf(structuredSearchWrapper)
  .parameter(0)
  .toEqualTypeOf<StructuredArgv>();
expectTypeOf(structuredSearchWrapper).returns.resolves.toBeVoid();

expectTypeOf(serviceStatusWrapper).toBeFunction();
expectTypeOf(serviceStatusWrapper)
  .parameter(0)
  .toEqualTypeOf<ServiceStatusArgv>();
expectTypeOf(serviceStatusWrapper).returns.resolves.toBeVoid();
