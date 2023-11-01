const FETCHER_BASE_URL = 'https://nominatim.openstreetmap.org'
const FETCHER_USER_AGENT = '@simple-nominatim/core'

export const dataFetcher = async (endpoint, params) => {
  const requestInfo = `${FETCHER_BASE_URL}/${endpoint}?${params.toString()}`
  const requestInit = { headers: { 'User-Agent': FETCHER_USER_AGENT } }

  const requestResponse = await fetch(requestInfo, requestInit)

  if (!requestResponse.ok) {
    throw new Error(
      `HTTP error! Status: ${requestResponse.status}. Text: ${requestResponse.statusText}`
    )
  }

  const parsedRequestResponse =
    params.get('format') === 'text' || params.get('format') === 'xml'
      ? await requestResponse.text()
      : await requestResponse.json()

  return parsedRequestResponse
}
