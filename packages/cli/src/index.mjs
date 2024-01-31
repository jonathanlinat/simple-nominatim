#! /usr/bin/env node

/**
 * MIT License
 *
 * Copyright (c) 2023-2024 Jonathan Linat <https://github.com/jonathanlinat>
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

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

import { freeFormSearchWrapper } from './search/free-form.mjs'
import { geocodeReverseWrapper } from './reverse/geocode.mjs'
import { serviceStatusWrapper } from './status/service.mjs'
import { structuredSearchWrapper } from './search/structured.mjs'
import {
  amenityOption,
  cityOption,
  countryOption,
  countyOption,
  emailOption,
  outputFormatOption,
  latitudeOption,
  limitOption,
  longitudeOption,
  postalCodeOption,
  queryOption,
  stateOption,
  statusFormatOption,
  streetOption
} from './_shared/yargsOptions.mjs'
;(() =>
  yargs(hideBin(process.argv))
    .command(
      'reverse:geocode',
      'Perform reverse geocoding',
      (yargs) => {
        return yargs
          .option('email', emailOption)
          .option('format', outputFormatOption)
          .option('latitude', latitudeOption)
          .option('longitude', longitudeOption)
      },
      (argv) => {
        geocodeReverseWrapper(argv)
      }
    )
    .command(
      'search:free-form',
      'Perform a free-form search',
      (yargs) => {
        return yargs
          .option('email', emailOption)
          .option('format', outputFormatOption)
          .option('limit', limitOption)
          .option('query', queryOption)
      },
      (argv) => {
        freeFormSearchWrapper(argv)
      }
    )
    .command(
      'search:structured',
      'Perform a structured search',
      (yargs) => {
        return yargs
          .option('amenity', amenityOption)
          .option('city', cityOption)
          .option('country', countryOption)
          .option('county', countyOption)
          .option('email', emailOption)
          .option('format', outputFormatOption)
          .option('limit', limitOption)
          .option('postalcode', postalCodeOption)
          .option('state', stateOption)
          .option('street', streetOption)
      },
      (argv) => {
        structuredSearchWrapper(argv)
      }
    )
    .command(
      'status:service',
      'Report on the state of the service and database',
      (yargs) => {
        return yargs.option('format', statusFormatOption)
      },
      (argv) => {
        serviceStatusWrapper(argv)
      }
    )
    .demandCommand(
      1,
      'No command specified. Use --help (or -h) to see the list of available commands.'
    )
    .help()
    .alias('help', 'h').argv)()
