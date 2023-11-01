import { dataFetcher } from '../_shared/dataFetcher'

export const structuredSearch = async (params, options) => {
  const endpoint = 'search'
  const urlSearchParams = new URLSearchParams()

  Object.keys(params).forEach((key) => {
    if (params[key]) {
      urlSearchParams.append(key, params[key])
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
