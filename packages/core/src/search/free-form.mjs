import { dataFetcher } from '../_shared/dataFetcher'

export const freeFormSearch = async (params, options) => {
  const endpoint = 'search'
  const urlSearchParams = new URLSearchParams()

  const { query: q } = params
  const parsedParams = { q }

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
