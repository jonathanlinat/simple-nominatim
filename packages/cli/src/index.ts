#! /usr/bin/env node

// SPDX-License-Identifier: MIT

import { Command } from "commander";

import { type OptionKey, options } from "./_shared/commanderOptions";
import { geocodeReverseWrapper } from "./reverse/geocode";
import { freeFormSearchWrapper } from "./search/freeForm";
import { structuredSearchWrapper } from "./search/structured";
import { serviceStatusWrapper } from "./status/service";

const packageJson = await import("../package.json", { with: { type: "json" } });

const COMMON_API_OPTS = [
  "addressDetails",
  "extraTags",
  "nameDetails",
  "entrances",
  "acceptLanguage",
  "layer",
  "polygonGeojson",
  "polygonKml",
  "polygonSvg",
  "polygonText",
  "polygonThreshold",
  "jsonCallback",
  "debug",
] as const satisfies readonly OptionKey[];

const SEARCH_FILTER_OPTS = [
  "countryCodes",
  "featureType",
  "excludePlaceIds",
  "viewbox",
  "bounded",
  "dedupe",
] as const satisfies readonly OptionKey[];

const program = new Command();

program
  .name("simple-nominatim")
  .description("CLI tool for interacting with the Nominatim API")
  .version(packageJson.default.version);

const addOptions = (
  cmd: ReturnType<typeof program.command>,
  keys: readonly OptionKey[],
): typeof cmd => {
  for (const o of options(keys)) {
    cmd.addOption(o);
  }

  return cmd;
};

addOptions(
  program.command("reverse:geocode").description("Perform reverse geocoding"),
  [
    "email",
    "outputFormat",
    "latitude",
    "longitude",
    ...COMMON_API_OPTS,
    "zoom",
  ],
).action(geocodeReverseWrapper);

addOptions(
  program.command("search:free-form").description("Perform a free-form search"),
  [
    "email",
    "outputFormat",
    "limit",
    "query",
    ...COMMON_API_OPTS,
    ...SEARCH_FILTER_OPTS,
  ],
).action(freeFormSearchWrapper);

addOptions(
  program
    .command("search:structured")
    .description("Perform a structured search"),
  [
    "amenity",
    "city",
    "country",
    "county",
    "email",
    "outputFormat",
    "limit",
    "postalCode",
    "state",
    "street",
    ...COMMON_API_OPTS,
    ...SEARCH_FILTER_OPTS,
  ],
).action(structuredSearchWrapper);

addOptions(
  program
    .command("status:service")
    .description("Report on the state of the service and database"),
  ["statusFormat"],
).action(serviceStatusWrapper);

program.parse();
