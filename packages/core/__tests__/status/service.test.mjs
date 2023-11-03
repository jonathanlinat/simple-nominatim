import { afterEach, beforeAll, describe, expect, it, mock } from 'bun:test'

import { serviceStatus } from '../../src/status/service.mjs'

describe('serviceStatus', () => {
  describe('Successful response', () => {
    const jsonScenario = {
      format: 'json',
      data: {
        status: 0,
        message: 'OK',
        data_updated: '2023-11-02T18:55:26+00:00',
        software_version: '4.3.0-0',
        database_version: '4.3.0-0'
      }
    }
    const textScenario = { format: 'text', data: 'OK' }

    beforeAll(() => {
      global.fetch = mock(() =>
        Promise.resolve({
          ok: true,
          json: () => jsonScenario.data,
          text: () => textScenario.data
        })
      )
    })

    afterEach(() => global.fetch.mockClear())

    it('should return a JSON response', async () => {
      const { format, data } = jsonScenario

      const options = { format }
      const result = await serviceStatus(options)

      expect(result).toEqual(data)
      expect(global.fetch).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should return a text response', async () => {
      const { format, data } = textScenario

      const options = { format }
      const result = await serviceStatus(options)

      expect(result).toEqual(data)
      expect(global.fetch).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })
})
