#! /usr/bin/env node

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

import { freeFormSearchWrapper } from './search/free-form'
import { geocodeReverseWrapper } from './reverse/geocode'
import { serviceStatusWrapper } from './status/service'
import { structuredSearchWrapper } from './search/structured'
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
} from './_shared/yargsOptions'
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
