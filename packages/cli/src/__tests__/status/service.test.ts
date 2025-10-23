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

import { serviceStatus } from '@simple-nominatim/core'

import { serviceStatusWrapper } from '../../status/service'

import type { ServiceStatusArgv } from '../../status/status.types'


vi.mock('@simple-nominatim/core', () => ({
  serviceStatus: vi.fn()
}))

describe('serviceStatusWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(serviceStatus).mockResolvedValue({
      status: 0,
      message: 'OK',
      data_updated: '2024-01-01T00:00:00Z'
    })
  })

  describe('basic functionality', () => {
    it('should call serviceStatus with correct format', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json'
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({ format: 'json' })
      )
    })

    it('should handle successful response', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json'
      }

      await serviceStatusWrapper(argv)

      expect(console.log).toHaveBeenCalled()
    })

    it('should support text format', async () => {
      const argv: ServiceStatusArgv = {
        format: 'text'
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({ format: 'text' })
      )
    })
  })

  describe('cache options', () => {
    it('should pass cache options when noCache is set', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        noCache: true
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          cache: expect.objectContaining({ enabled: false })
        })
      )
    })

    it('should pass cacheTtl option', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        cacheTtl: 5000
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          cache: expect.objectContaining({ ttl: 5000 })
        })
      )
    })

    it('should pass cacheMaxSize option', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        cacheMaxSize: 50
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          cache: expect.objectContaining({ maxSize: 50 })
        })
      )
    })

    it('should combine multiple cache options', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        cacheTtl: 8000,
        cacheMaxSize: 100
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          cache: expect.objectContaining({
            ttl: 8000,
            maxSize: 100
          })
        })
      )
    })
  })

  describe('rate limit options', () => {
    it('should pass rate limit options when noRateLimit is set', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        noRateLimit: true
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({ enabled: false })
        })
      )
    })

    it('should pass rateLimit option', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        rateLimit: 10
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({ limit: 10 })
        })
      )
    })

    it('should pass rateLimitInterval option', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        rateLimitInterval: 5000
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({ interval: 5000 })
        })
      )
    })

    it('should combine multiple rate limit options', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        rateLimit: 5,
        rateLimitInterval: 3000
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            limit: 5,
            interval: 3000
          })
        })
      )
    })
  })

  describe('retry options', () => {
    it('should pass retry options when noRetry is set', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        noRetry: true
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          retry: expect.objectContaining({ enabled: false })
        })
      )
    })

    it('should pass retryMaxAttempts option', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        retryMaxAttempts: 3
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          retry: expect.objectContaining({ maxAttempts: 3 })
        })
      )
    })

    it('should pass retryInitialDelay option', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        retryInitialDelay: 1000
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          retry: expect.objectContaining({ initialDelay: 1000 })
        })
      )
    })

    it('should combine multiple retry options', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        retryMaxAttempts: 4,
        retryInitialDelay: 2000
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          retry: expect.objectContaining({
            maxAttempts: 4,
            initialDelay: 2000
          })
        })
      )
    })
  })

  describe('error handling', () => {
    it('should handle API errors', async () => {
      vi.mocked(serviceStatus).mockRejectedValue(new Error('Service unavailable'))

      const argv: ServiceStatusArgv = {
        format: 'json'
      }

      await serviceStatusWrapper(argv)

      expect(console.error).toHaveBeenCalled()
    })

    it('should handle network errors', async () => {
      vi.mocked(serviceStatus).mockRejectedValue(new Error('Network error'))

      const argv: ServiceStatusArgv = {
        format: 'text'
      }

      await serviceStatusWrapper(argv)

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('integration', () => {
    it('should handle all options combined', async () => {
      const argv: ServiceStatusArgv = {
        format: 'json',
        cacheTtl: 10000,
        cacheMaxSize: 150,
        rateLimit: 8,
        rateLimitInterval: 4000,
        retryMaxAttempts: 5,
        retryInitialDelay: 1500
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          format: 'json',
          cache: expect.objectContaining({
            ttl: 10000,
            maxSize: 150
          }),
          rateLimit: expect.objectContaining({
            limit: 8,
            interval: 4000
          }),
          retry: expect.objectContaining({
            maxAttempts: 5,
            initialDelay: 1500
          })
        })
      )
    })

    it('should handle disabled features', async () => {
      const argv: ServiceStatusArgv = {
        format: 'text',
        noCache: true,
        noRateLimit: true,
        noRetry: true
      }

      await serviceStatusWrapper(argv)

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          cache: expect.objectContaining({ enabled: false }),
          rateLimit: expect.objectContaining({ enabled: false }),
          retry: expect.objectContaining({ enabled: false })
        })
      )
    })
  })

  describe('error handling', () => {
    it('should handle validation errors', async () => {
      const processExitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation(
          (() => {
            throw new Error('process.exit')
          }) as unknown as typeof process.exit
        )

      const argv = {
        format: 'invalid'
      } as unknown as ServiceStatusArgv

      try {
        await serviceStatusWrapper(argv)
      } catch (error) {
        expect((error as Error).message).toBe('process.exit')
      }

      expect(processExitSpy).toHaveBeenCalledWith(1)
      expect(console.error).toHaveBeenCalled()

      processExitSpy.mockRestore()
    })
  })
})
