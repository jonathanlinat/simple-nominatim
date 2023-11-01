import { structuredSearch } from '@simple-nominatim/core'

import { responseParser } from '../_shared/responseParser'

export const structuredSearchWrapper = (argv) => {
  const {
    amenity,
    city,
    country,
    county,
    email,
    format,
    limit,
    postalcode,
    state,
    street
  } = argv

  const params = { amenity, city, country, county, postalcode, state, street }
  const options = { email, format, limit }

  const response = structuredSearch(params, options)
  const handledResponse = responseParser(response)

  return handledResponse
}
