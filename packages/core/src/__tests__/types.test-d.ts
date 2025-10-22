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
import {
  freeFormSearch,
  structuredSearch,
  geocodeReverse,
  serviceStatus,
  CacheManager,
  RateLimiter,
  type OutputFormat,
  type BaseOptions,
  type SearchOptions,
  type ReverseOptions,
  type FreeFormSearchParams,
  type StructuredSearchParams,
  type GeocodeReverseParams,
  type StatusOptions,
  type StatusFormat,
  type CacheConfig,
  type RateLimitConfig,
  type DataFetcherOptions,
  type RetryConfig
} from '../index'

/**
 * Test OutputFormat type
 */
expectTypeOf<OutputFormat>().toEqualTypeOf<
  'xml' | 'json' | 'jsonv2' | 'geojson' | 'geocodejson'
>()

/**
 * Test StatusFormat type
 */
expectTypeOf<StatusFormat>().toEqualTypeOf<'text' | 'json'>()

/**
 * Test BaseOptions interface
 */
expectTypeOf<BaseOptions>().toMatchTypeOf<{
  email?: string
  format: OutputFormat
  cache?: CacheManager
  rateLimiter?: RateLimiter
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
 * Test FreeFormSearchParams interface
 */
expectTypeOf<FreeFormSearchParams>().toMatchTypeOf<{ query: string }>()

/**
 * Test StructuredSearchParams interface
 */
expectTypeOf<StructuredSearchParams>().toMatchTypeOf<{
  amenity?: string
  city?: string
  country?: string
  county?: string
  postalcode?: string
  state?: string
  street?: string
}>()

/**
 * Test GeocodeReverseParams interface
 */
expectTypeOf<GeocodeReverseParams>().toMatchTypeOf<{
  latitude: string
  longitude: string
}>()

/**
 * Test StatusOptions interface
 */
expectTypeOf<StatusOptions>().toMatchTypeOf<{
  format: StatusFormat
  cache?: CacheManager
  rateLimiter?: RateLimiter
}>()

/**
 * Test CacheConfig interface
 */
expectTypeOf<CacheConfig>().toMatchTypeOf<{
  enabled?: boolean
  ttl?: number
  maxSize?: number
}>()

/**
 * Test RateLimitConfig interface
 */
expectTypeOf<RateLimitConfig>().toMatchTypeOf<{
  enabled?: boolean
  limit?: number
  interval?: number
  strict?: boolean
}>()

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
  cache?: CacheManager
  rateLimiter?: RateLimiter
  retry?: RetryConfig
}>()

/**
 * Test freeFormSearch function signature
 */
expectTypeOf(freeFormSearch).toBeFunction()
expectTypeOf(freeFormSearch).parameter(0).toMatchTypeOf<FreeFormSearchParams>()
expectTypeOf(freeFormSearch).parameter(1).toMatchTypeOf<SearchOptions>()
expectTypeOf(freeFormSearch).returns.resolves.toBeUnknown()

/**
 * Test freeFormSearch with generic type
 */
interface CustomResponse {
  lat: string
  lon: string
}
expectTypeOf(freeFormSearch<CustomResponse>).returns.resolves.toEqualTypeOf<CustomResponse>()

/**
 * Test structuredSearch function signature
 */
expectTypeOf(structuredSearch).toBeFunction()
expectTypeOf(structuredSearch).parameter(0).toMatchTypeOf<StructuredSearchParams>()
expectTypeOf(structuredSearch).parameter(1).toMatchTypeOf<SearchOptions>()
expectTypeOf(structuredSearch).returns.resolves.toBeUnknown()

/**
 * Test structuredSearch with generic type
 */
expectTypeOf(structuredSearch<CustomResponse>).returns.resolves.toEqualTypeOf<CustomResponse>()

/**
 * Test geocodeReverse function signature
 */
expectTypeOf(geocodeReverse).toBeFunction()
expectTypeOf(geocodeReverse).parameter(0).toMatchTypeOf<GeocodeReverseParams>()
expectTypeOf(geocodeReverse).parameter(1).toMatchTypeOf<ReverseOptions>()
expectTypeOf(geocodeReverse).returns.resolves.toBeUnknown()

/**
 * Test geocodeReverse with generic type
 */
expectTypeOf(geocodeReverse<CustomResponse>).returns.resolves.toEqualTypeOf<CustomResponse>()

/**
 * Test serviceStatus function signature
 */
expectTypeOf(serviceStatus).toBeFunction()
expectTypeOf(serviceStatus).parameter(0).toMatchTypeOf<StatusOptions>()
expectTypeOf(serviceStatus).returns.resolves.toBeUnknown()

/**
 * Test serviceStatus with generic type
 */
interface StatusResponse {
  status: number
  message: string
}
expectTypeOf(serviceStatus<StatusResponse>).returns.resolves.toEqualTypeOf<StatusResponse>()

/**
 * Test CacheManager class
 */
expectTypeOf(CacheManager).toBeConstructibleWith({})
expectTypeOf(CacheManager).toBeConstructibleWith({ enabled: true })
expectTypeOf(CacheManager).toBeConstructibleWith({ ttl: 600000 })
expectTypeOf(CacheManager).toBeConstructibleWith({ maxSize: 1000 })

const cache = new CacheManager()
expectTypeOf(cache.get).toBeFunction()
expectTypeOf(cache.set).toBeFunction()
expectTypeOf(cache.has).toBeFunction()
expectTypeOf(cache.clear).toBeFunction()
expectTypeOf(cache.getStats).toBeFunction()
expectTypeOf(cache.isEnabled).toBeFunction()
expectTypeOf(cache.setEnabled).toBeFunction()

expectTypeOf(cache.getStats()).toMatchTypeOf<{
  hits: number
  misses: number
  hitRate: number
  size: number
}>()

/**
 * Test RateLimiter class
 */
expectTypeOf(RateLimiter).toBeConstructibleWith({})
expectTypeOf(RateLimiter).toBeConstructibleWith({ enabled: true })
expectTypeOf(RateLimiter).toBeConstructibleWith({ limit: 2 })
expectTypeOf(RateLimiter).toBeConstructibleWith({ interval: 2000 })
expectTypeOf(RateLimiter).toBeConstructibleWith({ strict: false })

const rateLimiter = new RateLimiter()
expectTypeOf(rateLimiter.execute).toBeFunction()
expectTypeOf(rateLimiter.getStats).toBeFunction()
expectTypeOf(rateLimiter.resetStats).toBeFunction()
expectTypeOf(rateLimiter.isEnabled).toBeFunction()
expectTypeOf(rateLimiter.setEnabled).toBeFunction()

expectTypeOf(rateLimiter.getStats()).toMatchTypeOf<{
  requestCount: number
  queuedCount: number
}>()

/**
 * Test that optional parameters work correctly
 */
const result1 = freeFormSearch({ query: 'test' }, { format: 'json' })
expectTypeOf(result1).toEqualTypeOf<Promise<unknown>>()

const result2 = freeFormSearch({ query: 'test' }, { format: 'json', email: 'test@example.com' })
expectTypeOf(result2).toEqualTypeOf<Promise<unknown>>()

const result3 = freeFormSearch({ query: 'test' }, { format: 'json', limit: 10 })
expectTypeOf(result3).toEqualTypeOf<Promise<unknown>>()

/**
 * Test cache and rateLimiter integration
 */
const result4 = freeFormSearch({ query: 'test' }, { format: 'json', cache: new CacheManager() })
expectTypeOf(result4).toEqualTypeOf<Promise<unknown>>()

const result5 = freeFormSearch(
  { query: 'test' },
  { format: 'json', rateLimiter: new RateLimiter() }
)
expectTypeOf(result5).toEqualTypeOf<Promise<unknown>>()

const result6 = freeFormSearch(
  { query: 'test' },
  { format: 'json', cache: new CacheManager(), rateLimiter: new RateLimiter() }
)
expectTypeOf(result6).toEqualTypeOf<Promise<unknown>>()
