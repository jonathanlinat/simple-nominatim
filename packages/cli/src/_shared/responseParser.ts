/**
 * MIT License
 *
 * Copyright (c) 2023-2025 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software:"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Parses and outputs API responses to the console
 *
 * This function handles the output formatting for all CLI commands. It awaits the
 * promise from a core library function, stringifies the response as JSON, and
 * outputs it to stdout. If an error occurs during the API call, it catches the
 * error and outputs a user-friendly message to stderr.
 *
 * @template T - The type of the API response
 * @param {Promise<T>} promise A promise that resolves with the API response
 * @returns {Promise<void>} A promise that resolves when output is complete
 *
 * @internal
 */
export async function responseParser<T>(promise: Promise<T>): Promise<void> {
  try {
    const response = await promise
    const stringifiedResponse = JSON.stringify(response)

    console.log(stringifiedResponse)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Ups! Something went wrong... ${message}`)
  }
}
