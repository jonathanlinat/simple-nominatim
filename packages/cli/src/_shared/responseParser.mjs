export async function responseParser(promise) {
  try {
    const response = await promise
    const stringifiedResponse = JSON.stringify(response)

    console.log(stringifiedResponse)
  } catch (error) {
    console.error(`Ups! Something went wrong... ${error.message}`)
  }
}
