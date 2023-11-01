import { dataFetcher } from '../_shared/dataFetcher'

export const geocodeReverse = async (params, options) => {
  const endpoint = 'reverse'
  const urlSearchParams = new URLSearchParams()

  const { latitude: lat, longitude: lon } = params
  const parsedParams = { lat, lon }

  Object.keys(parsedParams).forEach((key) => {
    if (parsedParams[key]) {
      urlSearchParams.append(key, parsedParams[key])
    }
  })

  Object.keys(options).forEach((key) => {
    if (options[key]) {
      urlSearchParams.append(key, options[key])
    }
  })

  const fetchedData = await dataFetcher(endpoint, urlSearchParams)

  return fetchedData
}
