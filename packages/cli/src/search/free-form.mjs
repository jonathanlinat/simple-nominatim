import { freeFormSearch } from '@simple-nominatim/core'

import { responseParser } from '../_shared/responseParser'

export const freeFormSearchWrapper = (argv) => {
  const { email, format, limit, query } = argv

  const params = { query }
  const options = { email, format, limit }

  const response = freeFormSearch(params, options)
  const handledResponse = responseParser(response)

  return handledResponse
}
