#! /usr/bin/env node

/**
 * MIT License
 *
 * Copyright (c) 2023-2025 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
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

import { Command } from "commander";

import {
  acceptLanguageOption,
  addressDetailsOption,
  amenityOption,
  boundedOption,
  cacheTtlOption,
  cacheMaxSizeOption,
  cityOption,
  countryCodesOption,
  countryOption,
  countyOption,
  debugOption,
  dedupeOption,
  emailOption,
  entrancesOption,
  excludePlaceIdsOption,
  extraTagsOption,
  featureTypeOption,
  jsonCallbackOption,
  layerOption,
  outputFormatOption,
  latitudeOption,
  limitOption,
  longitudeOption,
  nameDetailsOption,
  noCacheOption,
  noRateLimitOption,
  noRetryOption,
  polygonGeojsonOption,
  polygonKmlOption,
  polygonSvgOption,
  polygonTextOption,
  polygonThresholdOption,
  postalCodeOption,
  queryOption,
  rateLimitOption,
  rateLimitIntervalOption,
  retryMaxAttemptsOption,
  retryInitialDelayOption,
  stateOption,
  statusFormatOption,
  streetOption,
  viewboxOption,
  zoomOption,
} from "./_shared/commanderOptions";
import { geocodeReverseWrapper } from "./reverse/geocode";
import { freeFormSearchWrapper } from "./search/freeForm";
import { structuredSearchWrapper } from "./search/structured";
import { serviceStatusWrapper } from "./status/service";

const packageJson = await import("../package.json", {
  with: { type: "json" },
});

const program = new Command();

program
  .name("simple-nominatim")
  .description("CLI tool for interacting with the Nominatim API")
  .version(packageJson.default.version);

program
  .command("reverse:geocode")
  .description("Perform reverse geocoding")
  .addOption(emailOption)
  .addOption(outputFormatOption)
  .addOption(latitudeOption)
  .addOption(longitudeOption)
  .addOption(addressDetailsOption)
  .addOption(extraTagsOption)
  .addOption(nameDetailsOption)
  .addOption(entrancesOption)
  .addOption(acceptLanguageOption)
  .addOption(zoomOption)
  .addOption(layerOption)
  .addOption(polygonGeojsonOption)
  .addOption(polygonKmlOption)
  .addOption(polygonSvgOption)
  .addOption(polygonTextOption)
  .addOption(polygonThresholdOption)
  .addOption(jsonCallbackOption)
  .addOption(debugOption)
  .addOption(noCacheOption)
  .addOption(cacheTtlOption)
  .addOption(cacheMaxSizeOption)
  .addOption(noRateLimitOption)
  .addOption(rateLimitOption)
  .addOption(rateLimitIntervalOption)
  .addOption(noRetryOption)
  .addOption(retryMaxAttemptsOption)
  .addOption(retryInitialDelayOption)
  .action(geocodeReverseWrapper);

program
  .command("search:free-form")
  .description("Perform a free-form search")
  .addOption(emailOption)
  .addOption(outputFormatOption)
  .addOption(limitOption)
  .addOption(queryOption)
  .addOption(addressDetailsOption)
  .addOption(extraTagsOption)
  .addOption(nameDetailsOption)
  .addOption(entrancesOption)
  .addOption(acceptLanguageOption)
  .addOption(countryCodesOption)
  .addOption(layerOption)
  .addOption(featureTypeOption)
  .addOption(excludePlaceIdsOption)
  .addOption(viewboxOption)
  .addOption(boundedOption)
  .addOption(polygonGeojsonOption)
  .addOption(polygonKmlOption)
  .addOption(polygonSvgOption)
  .addOption(polygonTextOption)
  .addOption(polygonThresholdOption)
  .addOption(jsonCallbackOption)
  .addOption(dedupeOption)
  .addOption(debugOption)
  .addOption(noCacheOption)
  .addOption(cacheTtlOption)
  .addOption(cacheMaxSizeOption)
  .addOption(noRateLimitOption)
  .addOption(rateLimitOption)
  .addOption(rateLimitIntervalOption)
  .addOption(noRetryOption)
  .addOption(retryMaxAttemptsOption)
  .addOption(retryInitialDelayOption)
  .action(freeFormSearchWrapper);

program
  .command("search:structured")
  .description("Perform a structured search")
  .addOption(amenityOption)
  .addOption(cityOption)
  .addOption(countryOption)
  .addOption(countyOption)
  .addOption(emailOption)
  .addOption(outputFormatOption)
  .addOption(limitOption)
  .addOption(postalCodeOption)
  .addOption(stateOption)
  .addOption(streetOption)
  .addOption(addressDetailsOption)
  .addOption(extraTagsOption)
  .addOption(nameDetailsOption)
  .addOption(entrancesOption)
  .addOption(acceptLanguageOption)
  .addOption(countryCodesOption)
  .addOption(layerOption)
  .addOption(featureTypeOption)
  .addOption(excludePlaceIdsOption)
  .addOption(viewboxOption)
  .addOption(boundedOption)
  .addOption(polygonGeojsonOption)
  .addOption(polygonKmlOption)
  .addOption(polygonSvgOption)
  .addOption(polygonTextOption)
  .addOption(polygonThresholdOption)
  .addOption(jsonCallbackOption)
  .addOption(dedupeOption)
  .addOption(debugOption)
  .addOption(noCacheOption)
  .addOption(cacheTtlOption)
  .addOption(cacheMaxSizeOption)
  .addOption(noRateLimitOption)
  .addOption(rateLimitOption)
  .addOption(rateLimitIntervalOption)
  .addOption(noRetryOption)
  .addOption(retryMaxAttemptsOption)
  .addOption(retryInitialDelayOption)
  .action(structuredSearchWrapper);

program
  .command("status:service")
  .description("Report on the state of the service and database")
  .addOption(statusFormatOption)
  .addOption(noCacheOption)
  .addOption(cacheTtlOption)
  .addOption(cacheMaxSizeOption)
  .addOption(noRateLimitOption)
  .addOption(rateLimitOption)
  .addOption(rateLimitIntervalOption)
  .addOption(noRetryOption)
  .addOption(retryMaxAttemptsOption)
  .addOption(retryInitialDelayOption)
  .action(serviceStatusWrapper);

program.parse();
