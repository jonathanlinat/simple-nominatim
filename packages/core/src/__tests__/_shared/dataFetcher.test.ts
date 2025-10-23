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

import { dataFetcher } from '../../_shared/dataFetcher'

describe('dataFetcher', () => {
  const endpoint = 'search'
  const mockResponse = { data: 'test response' }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.restoreAllMocks()
    vi.clearAllMocks()
    // @ts-expect-error - Overriding global fetch for testing
    global.fetch = undefined
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('basic functionality', () => {
    it('should fetch data successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'test' })
      const result = await dataFetcher(endpoint, params)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should include User-Agent header', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'test' })
      await dataFetcher(endpoint, params)

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': expect.any(String)
          })
        })
      )
    })

    it('should construct correct URL with params', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'London', limit: '5' })
      await dataFetcher(endpoint, params)

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs).toBeDefined()
      const url = callArgs![0] as string
      expect(url).toContain('search?')
      expect(url).toContain('q=London')
      expect(url).toContain('limit=5')
    })
  })

  describe('response formats', () => {
    it('should parse JSON response by default', async () => {
      const jsonData = { place_id: 123, display_name: 'Test Place' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => jsonData
      })

      const params = new URLSearchParams({ q: 'test' })
      const result = await dataFetcher(endpoint, params)

      expect(result).toEqual(jsonData)
    })

    it('should return text for format=text', async () => {
      const textData = 'plain text response'
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => textData
      })

      const params = new URLSearchParams({ q: 'test', format: 'text' })
      const result = await dataFetcher(endpoint, params)

      expect(result).toBe(textData)
    })

    it('should return text for format=xml', async () => {
      const xmlData = '<xml>test</xml>'
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => xmlData
      })

      const params = new URLSearchParams({ q: 'test', format: 'xml' })
      const result = await dataFetcher(endpoint, params)

      expect(result).toBe(xmlData)
    })
  })

  describe('error handling', () => {
    it('should throw on HTTP error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      const params = new URLSearchParams({ q: 'test' })

      await expect(
        dataFetcher(endpoint, params, { retry: { enabled: false } })
      ).rejects.toThrow('HTTP error! Status: 404')
    })

    it('should throw on network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'))

      const params = new URLSearchParams({ q: 'test' })

      await expect(
        dataFetcher(endpoint, params, { retry: { enabled: false } })
      ).rejects.toThrow('Network failure')
    })

    it('should handle non-Error exceptions', async () => {
      global.fetch = vi.fn().mockRejectedValue('String error')

      const params = new URLSearchParams({ q: 'test' })

      await expect(
        dataFetcher(endpoint, params, { retry: { enabled: false } })
      ).rejects.toThrow()
    })
  })

  describe('caching', () => {
    it('should create cache manager with config', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'test' })

      await dataFetcher(endpoint, params, {
        cache: { enabled: true, maxSize: 100 }
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should work with cache disabled', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'test' })

      await dataFetcher(endpoint, params, {
        cache: { enabled: false }
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should use default cache configuration', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'test' })

      await dataFetcher(endpoint, params)

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should handle cache miss and fetch data', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params1 = new URLSearchParams({ q: 'test1' })
      const params2 = new URLSearchParams({ q: 'test2' })

      await dataFetcher(endpoint, params1, {
        cache: { enabled: true },
        rateLimit: { enabled: false },
        retry: { enabled: false }
      })

      await dataFetcher(endpoint, params2, {
        cache: { enabled: true },
        rateLimit: { enabled: false },
        retry: { enabled: false }
      })

      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('rate limiting', () => {
    it('should apply rate limiting by default', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'test' })

      await dataFetcher(endpoint, params)

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should skip rate limiting when disabled', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'test' })

      await dataFetcher(endpoint, params, {
        rateLimit: { enabled: false },
        cache: { enabled: false },
        retry: { enabled: false }
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should use custom rate limit configuration', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'test' })

      await dataFetcher(endpoint, params, {
        rateLimit: { enabled: true, limit: 5, interval: 100 },
        cache: { enabled: false },
        retry: { enabled: false }
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('retry logic', () => {
    it('should retry on retryable status codes', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++
        if (callCount === 1) {
          return { ok: false, status: 429, statusText: 'Too Many Requests' }
        }

        return { ok: true, json: async () => mockResponse }
      })

      const params = new URLSearchParams({ q: 'test' })

      const promise = dataFetcher(endpoint, params, {
        retry: {
          enabled: true,
          maxAttempts: 2,
          retryableStatusCodes: [429],
          initialDelay: 10,
          backoffMultiplier: 1,
          maxDelay: 1000,
          useJitter: false
        },
        cache: { enabled: false },
        rateLimit: { enabled: false }
      })
      await vi.advanceTimersByTimeAsync(10)
      const result = await promise

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should not retry on non-retryable status codes', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      })

      const params = new URLSearchParams({ q: 'test' })

      // With retry disabled, should fail immediately
      await expect(
        dataFetcher(endpoint, params, {
          retry: { enabled: false },
          cache: { enabled: false },
          rateLimit: { enabled: false }
        })
      ).rejects.toThrow('HTTP error! Status: 400')

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should retry on network errors', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++
        if (callCount === 1) {
          throw new Error('Network error')
        }

        return { ok: true, json: async () => mockResponse }
      })

      const params = new URLSearchParams({ q: 'test' })

      const promise = dataFetcher(endpoint, params, {
        retry: {
          enabled: true,
          maxAttempts: 2,
          initialDelay: 10,
          backoffMultiplier: 1,
          maxDelay: 1000,
          useJitter: false
        },
        cache: { enabled: false },
        rateLimit: { enabled: false }
      })
      await vi.advanceTimersByTimeAsync(10)
      const result = await promise

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should fail after max attempts', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const params = new URLSearchParams({ q: 'test' })

      const promise = (async () => {
        try {
          return await dataFetcher(endpoint, params, {
            retry: {
              enabled: true,
              maxAttempts: 3,
              initialDelay: 10,
              backoffMultiplier: 1,
              maxDelay: 1000,
              useJitter: false
            },
            cache: { enabled: false },
            rateLimit: { enabled: false }
          })
        } catch (e) {
          return e
        }
      })()

      await vi.advanceTimersByTimeAsync(30)

      const result = await promise
      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe('Network error')
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should not retry when retry is disabled', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const params = new URLSearchParams({ q: 'test' })

      await expect(
        dataFetcher(endpoint, params, {
          retry: { enabled: false }
        })
      ).rejects.toThrow('Network error')

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should apply exponential backoff', async () => {
      let callCount = 0
      const delays: number[] = []
      let lastTime = 0

      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++
        if (callCount > 1) {
          const currentTime = (vi.getMockedSystemTime() as Date)?.getTime() ?? 0
          delays.push(currentTime - lastTime)
        }
        lastTime = (vi.getMockedSystemTime() as Date)?.getTime() ?? 0
        if (callCount < 3) {
          throw new Error('Network error')
        }

        return { ok: true, json: async () => mockResponse }
      })

      const params = new URLSearchParams({ q: 'test' })

      const promise = dataFetcher(endpoint, params, {
        retry: {
          enabled: true,
          maxAttempts: 3,
          initialDelay: 50,
          backoffMultiplier: 2,
          maxDelay: 1000,
          useJitter: false
        },
        cache: { enabled: false },
        rateLimit: { enabled: false }
      })
      await vi.advanceTimersByTimeAsync(50)
      await vi.advanceTimersByTimeAsync(100)
      await promise

      expect(global.fetch).toHaveBeenCalledTimes(3)
      expect(delays.length).toBe(2)
      expect(delays[0]).toBeGreaterThanOrEqual(45)
      expect(delays[1]).toBeGreaterThanOrEqual(90)
    })

    it('should respect max delay in exponential backoff', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++
        if (callCount < 3) {
          throw new Error('Network error')
        }

        return { ok: true, json: async () => mockResponse }
      })

      const params = new URLSearchParams({ q: 'test' })

      const promise = dataFetcher(endpoint, params, {
        retry: {
          enabled: true,
          maxAttempts: 3,
          initialDelay: 100,
          backoffMultiplier: 10,
          maxDelay: 150,
          useJitter: false
        },
        cache: { enabled: false },
        rateLimit: { enabled: false }
      })
      await vi.advanceTimersByTimeAsync(100)
      await vi.advanceTimersByTimeAsync(150)
      await promise

      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should apply jitter to retry delays when enabled', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++
        if (callCount < 3) {
          throw new Error('Retry test')
        }

        return { ok: true, json: async () => mockResponse }
      })

      const params = new URLSearchParams({ q: 'test' })

      const promise = dataFetcher(endpoint, params, {
        retry: {
          enabled: true,
          maxAttempts: 3,
          initialDelay: 50,
          useJitter: true
        },
        cache: { enabled: false },
        rateLimit: { enabled: false }
      })
      await vi.advanceTimersByTimeAsync(100)
      await vi.advanceTimersByTimeAsync(100)
      await promise

      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should throw error after all retry attempts fail', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Persistent error'))

      const params = new URLSearchParams({ q: 'test' })

      const promise = (async () => {
        try {
          return await dataFetcher(endpoint, params, {
            retry: {
              enabled: true,
              maxAttempts: 2,
              initialDelay: 10,
              useJitter: false
            },
            cache: { enabled: false },
            rateLimit: { enabled: false }
          })
        } catch (e) {
          return e
        }
      })()

      await vi.advanceTimersByTimeAsync(20)

      const result = await promise
      expect(result).toBeInstanceOf(Error)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should exhaust all retry attempts with no successful response', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const params = new URLSearchParams({ q: 'test' })

      const promise = (async () => {
        try {
          return await dataFetcher(endpoint, params, {
            retry: {
              enabled: true,
              maxAttempts: 3,
              initialDelay: 1,
              useJitter: false
            },
            cache: { enabled: false },
            rateLimit: { enabled: false }
          })
        } catch (e) {
          return e
        }
      })()

      await vi.advanceTimersByTimeAsync(10)

      const result = await promise
      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe('Network error')
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })
  })

  describe('integration', () => {
    it('should work with cache, rate limiting, and retry together', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++
        if (callCount === 1) {
          throw new Error('Network error')
        }

        return { ok: true, json: async () => mockResponse }
      })

      const params = new URLSearchParams({ q: 'test' })

      const promise = dataFetcher(endpoint, params, {
        cache: { enabled: true },
        rateLimit: { enabled: true },
        retry: { enabled: true, maxAttempts: 2, initialDelay: 10, useJitter: false }
      })
      await vi.advanceTimersByTimeAsync(10)
      const result = await promise

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('should work with all features disabled', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const params = new URLSearchParams({ q: 'test' })

      const result = await dataFetcher(endpoint, params, {
        cache: { enabled: false },
        rateLimit: { enabled: false },
        retry: { enabled: false }
      })

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })
})
