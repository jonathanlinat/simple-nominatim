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

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { freeFormSearch } from '../../search/free-form'

describe('freeFormSearch', () => {
  const mockResponse = [
    {
      place_id: 123,
      display_name: 'London, UK',
      lat: '51.5074',
      lon: '-0.1278'
    }
  ]

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    // @ts-expect-error - Overriding global fetch for testing
    global.fetch = undefined
  })

  describe('basic functionality', () => {
    it('should perform free-form search with query', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const result = await freeFormSearch(
        { query: 'London' },
        { format: 'json' }
      )

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should construct URL with query parameter', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'New York City' },
        { format: 'json' }
      )

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs).toBeDefined()
      const url = callArgs![0] as string
      expect(url).toContain('search?')
      expect(url).toContain('q=New+York+City')
    })

    it('should return array of results', async () => {
      const customResponse = [
        { place_id: 1, display_name: 'Place 1' },
        { place_id: 2, display_name: 'Place 2' }
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => customResponse
      })

      const result = await freeFormSearch(
        { query: 'test' },
        { format: 'json' }
      )

      expect(result).toEqual(customResponse)
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('search options', () => {
    it('should include limit parameter', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'London' },
        { format: 'json', limit: 5 }
      )

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs).toBeDefined()
      const url = callArgs![0] as string
      expect(url).toContain('limit=5')
    })

    it('should include addressdetails parameter', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'London' },
        { format: 'json', addressdetails: 1 }
      )

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs).toBeDefined()
      const url = callArgs![0] as string
      expect(url).toContain('addressdetails=1')
    })

    it('should include multiple parameters', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'London' },
        {
          format: 'json',
          limit: 10,
          addressdetails: 1,
          'accept-language': 'en'
        }
      )

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs).toBeDefined()
      const url = callArgs![0] as string
      expect(url).toContain('format=json')
      expect(url).toContain('limit=10')
      expect(url).toContain('addressdetails=1')
      expect(url).toContain('accept-language=en')
    })

    it('should omit undefined parameters', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'London' },
        { format: 'json', limit: undefined }
      )

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs).toBeDefined()
      const url = callArgs![0] as string
      expect(url).toContain('format=json')
      expect(url).not.toContain('limit=')
    })
  })

  describe('cache options', () => {
    it('should work with cache disabled', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'London' },
        { format: 'json', cache: { enabled: false } }
      )

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should work with custom cache settings', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'London' },
        { format: 'json', cache: { enabled: true, maxSize: 200 } }
      )

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('rate limit options', () => {
    it('should work with rate limiting disabled', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'London' },
        { format: 'json', rateLimit: { enabled: false } }
      )

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should work with custom rate limit settings', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'London' },
        { format: 'json', rateLimit: { enabled: true, limit: 3 } }
      )

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('retry options', () => {
    it('should work with retry disabled', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'London' },
        { format: 'json', retry: { enabled: false } }
      )

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++
        if (callCount === 1) {
          throw new Error('Network error')
        }

        return { ok: true, json: async () => mockResponse }
      })

      const result = await freeFormSearch(
        { query: 'London' },
        {
          format: 'json',
          retry: { enabled: true, maxAttempts: 2, initialDelay: 10, useJitter: false },
          rateLimit: { enabled: false }
        }
      )

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('error handling', () => {
    it('should throw on HTTP error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      })

      await expect(
        freeFormSearch(
          { query: 'invalid query' },
          { format: 'json', retry: { enabled: false } }
        )
      ).rejects.toThrow('HTTP error')
    })

    it('should throw on network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'))

      await expect(
        freeFormSearch(
          { query: 'London' },
          { format: 'json', retry: { enabled: false } }
        )
      ).rejects.toThrow('Network failure')
    })
  })

  describe('query variations', () => {
    it('should handle simple queries', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'Paris' },
        { format: 'json' }
      )

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs).toBeDefined()
      const url = callArgs![0] as string
      expect(url).toContain('q=Paris')
    })

    it('should handle multi-word queries', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'New York City' },
        { format: 'json' }
      )

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      expect(callArgs).toBeDefined()
      const url = callArgs![0] as string
      expect(url).toContain('q=New+York+City')
    })

    it('should handle queries with special characters', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      await freeFormSearch(
        { query: 'São Paulo, Brazil' },
        { format: 'json' }
      )

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('integration', () => {
    it('should work with all options combined', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const result = await freeFormSearch(
        { query: 'London' },
        {
          format: 'json',
          limit: 5,
          addressdetails: 1,
          cache: { enabled: true },
          rateLimit: { enabled: true },
          retry: { enabled: true }
        }
      )

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })
})
