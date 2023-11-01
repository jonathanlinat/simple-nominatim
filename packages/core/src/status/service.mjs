import { dataFetcher } from '../_shared/dataFetcher'

export const serviceStatus = async (options) => {
  const endpoint = 'status'
  const urlSearchParams = new URLSearchParams()

  Object.keys(options).forEach((key) => {
    if (options[key]) {
      urlSearchParams.append(key, options[key])
    }
  })

  const fetchedData = await dataFetcher(endpoint, urlSearchParams)

  return fetchedData
}
