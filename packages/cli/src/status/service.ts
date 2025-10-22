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

import { serviceStatus } from '@simple-nominatim/core'
import type { StatusOptions } from '@simple-nominatim/core'

import { responseParser } from '../_shared/responseParser'
import { safeValidateArgs, serviceStatusSchema } from '../_shared/validation'
import type { ServiceStatusArgv } from './status.types'

/**
 * CLI wrapper for service status functionality
 *
 * This function wraps the core service status functionality for use in the CLI.
 * It transforms CLI arguments into the format expected by the core library,
 * queries the API status, and outputs the results to the console.
 *
 * @param {ServiceStatusArgv} argv - Command-line arguments from Yargs
 * @returns {Promise<void>} A promise that resolves when the status check is complete
 *
 * @internal This is an internal CLI function called by the command handler
 *
 * @example
 * ```typescript
 * // Called internally by: simple-nominatim status:service --format json
 * await serviceStatusWrapper({
 *   format: 'json'
 * });
 * ```
 */
export const serviceStatusWrapper = (
  argv: ServiceStatusArgv
): Promise<void> => {
  const { format } = argv

  const validationResult = safeValidateArgs(serviceStatusSchema, {
    statusFormat: format
  })

  if (!validationResult.success) {
    console.error('Validation error:')
    validationResult.error.issues.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`)
    })
    process.exit(1)
  }

  const options: StatusOptions = { format }

  const response = serviceStatus(options)
  const handledResponse = responseParser(response)

  return handledResponse
}
