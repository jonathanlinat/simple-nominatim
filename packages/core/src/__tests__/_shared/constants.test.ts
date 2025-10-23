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

import { describe, expect, it } from 'vitest'

import {
  DEFAULT_CACHE_CONFIG,
  DEFAULT_RATE_LIMIT_CONFIG,
  DEFAULT_RETRY_CONFIG,
  FETCHER_BASE_URL,
  FETCHER_USER_AGENT
} from '../../_shared/constants'

describe('Constants', () => {
  describe('FETCHER_BASE_URL', () => {
    it('should be the official OSM Nominatim URL', () => {
      expect(FETCHER_BASE_URL).toBe('https://nominatim.openstreetmap.org')
    })

    it('should be a valid URL', () => {
      expect(() => new URL(FETCHER_BASE_URL)).not.toThrow()
    })
  })

  describe('FETCHER_USER_AGENT', () => {
    it('should identify as @simple-nominatim/core', () => {
      expect(FETCHER_USER_AGENT).toBe('@simple-nominatim/core')
    })

    it('should be a non-empty string', () => {
      expect(FETCHER_USER_AGENT).toBeTruthy()
      expect(FETCHER_USER_AGENT.length).toBeGreaterThan(0)
    })
  })

  describe('DEFAULT_CACHE_CONFIG', () => {
    it('should be enabled by default', () => {
      expect(DEFAULT_CACHE_CONFIG.enabled).toBe(true)
    })

    it('should have a 5 minute TTL', () => {
      expect(DEFAULT_CACHE_CONFIG.ttl).toBe(300000)
    })

    it('should have a maximum size of 500 entries', () => {
      expect(DEFAULT_CACHE_CONFIG.maxSize).toBe(500)
    })
  })

  describe('DEFAULT_RATE_LIMIT_CONFIG', () => {
    it('should be enabled by default', () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.enabled).toBe(true)
    })

    it('should allow 1 request per interval', () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.limit).toBe(1)
    })

    it('should have 1 second interval', () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.interval).toBe(1000)
    })

    it('should be strict by default', () => {
      expect(DEFAULT_RATE_LIMIT_CONFIG.strict).toBe(true)
    })
  })

  describe('DEFAULT_RETRY_CONFIG', () => {
    it('should be enabled by default', () => {
      expect(DEFAULT_RETRY_CONFIG.enabled).toBe(true)
    })

    it('should have 3 max attempts', () => {
      expect(DEFAULT_RETRY_CONFIG.maxAttempts).toBe(3)
    })

    it('should have a 1 second initial delay', () => {
      expect(DEFAULT_RETRY_CONFIG.initialDelay).toBe(1000)
    })

    it('should have a 10 second max delay', () => {
      expect(DEFAULT_RETRY_CONFIG.maxDelay).toBe(10000)
    })

    it('should use exponential backoff with multiplier 2', () => {
      expect(DEFAULT_RETRY_CONFIG.backoffMultiplier).toBe(2)
    })

    it('should use jitter by default', () => {
      expect(DEFAULT_RETRY_CONFIG.useJitter).toBe(true)
    })

    it('should retry on common HTTP error codes', () => {
      expect(DEFAULT_RETRY_CONFIG.retryableStatusCodes).toEqual([
        408, 429, 500, 502, 503, 504
      ])
    })
  })
})
