import { serviceStatus } from '@simple-nominatim/core'

import { responseParser } from '../_shared/responseParser'

export const serviceStatusWrapper = (argv) => {
  const { format } = argv

  const options = { format }

  const response = serviceStatus(options)
  const handledResponse = responseParser(response)

  return handledResponse
}
