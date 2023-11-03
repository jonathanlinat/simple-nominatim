import { geocodeReverse } from '@simple-nominatim/core'

import { responseParser } from '../_shared/responseParser.mjs'

export const geocodeReverseWrapper = (argv) => {
  const { email, format, latitude, longitude } = argv

  const params = { latitude, longitude }
  const options = { email, format }

  const response = geocodeReverse(params, options)
  const handledResponse = responseParser(response)

  return handledResponse
}
