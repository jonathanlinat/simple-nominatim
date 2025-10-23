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

import { expectTypeOf } from 'vitest'

import type {
  OutputFormat,
  BaseOptions,
  SearchOptions,
  ReverseOptions,
  DataFetcherOptions,
  RetryConfig,
  CacheConfig,
  RateLimitConfig
} from '../../index'

/**
 * Test OutputFormat type
 */
expectTypeOf<OutputFormat>().toEqualTypeOf<
  'xml' | 'json' | 'jsonv2' | 'geojson' | 'geocodejson'
>()

/**
 * Test BaseOptions interface
 */
expectTypeOf<BaseOptions>().toMatchTypeOf<{
  email?: string
  format: OutputFormat
  cache?: CacheConfig
  rateLimit?: RateLimitConfig
}>()

/**
 * Test SearchOptions extends BaseOptions
 */
expectTypeOf<SearchOptions>().toMatchTypeOf<BaseOptions>()
expectTypeOf<SearchOptions>().toMatchTypeOf<{ limit?: number }>()

/**
 * Test ReverseOptions is alias of BaseOptions
 */
expectTypeOf<ReverseOptions>().toEqualTypeOf<BaseOptions>()

/**
 * Test RetryConfig interface
 */
expectTypeOf<RetryConfig>().toMatchTypeOf<{
  enabled?: boolean
  maxAttempts?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  useJitter?: boolean
  retryableStatusCodes?: number[]
}>()

/**
 * Test DataFetcherOptions interface
 */
expectTypeOf<DataFetcherOptions>().toMatchTypeOf<{
  cache?: CacheConfig
  rateLimit?: RateLimitConfig
  retry?: RetryConfig
}>()
