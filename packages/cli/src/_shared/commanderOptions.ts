// SPDX-License-Identifier: MIT

import { Option } from "commander";

type Spec = {
  flags: string;
  description: string;
  choices?: readonly string[];
  mandatory?: boolean;
  int?: boolean;
};

const SPECS = {
  amenity: {
    flags: "--amenity <amenity>",
    description: "Specify the name or type of point of interest (POI).",
  },
  city: { flags: "--city <city>", description: "Specify the city name." },
  country: {
    flags: "--country <country>",
    description: "Specify the country name.",
  },
  county: {
    flags: "--county <county>",
    description: "Specify the county name.",
  },
  email: {
    flags: "-e, --email <email>",
    description:
      "Specify an appropriate email address when making large numbers of requests.",
  },
  outputFormat: {
    flags: "-f, --format <format>",
    description: "Specify the desired output format.",
    choices: ["xml", "json", "jsonv2", "geojson", "geocodejson"] as const,
    mandatory: true,
  },
  latitude: {
    flags: "--latitude <latitude>",
    description: "Specify the latitude coordinate.",
  },
  longitude: {
    flags: "--longitude <longitude>",
    description: "Specify the longitude coordinate.",
  },
  limit: {
    flags: "--limit <limit>",
    description: "Specify the maximum number of results (1-40).",
    int: true,
  },
  postalCode: {
    flags: "--postal-code <postalCode>",
    description: "Specify the postal code.",
  },
  query: {
    flags: "-q, --query <query>",
    description: "Specify the search query string.",
  },
  state: { flags: "--state <state>", description: "Specify the state name." },
  street: {
    flags: "--street <street>",
    description: "Specify the street address.",
  },
  statusFormat: {
    flags: "-f, --format <format>",
    description: "Specify the desired output format.",
    choices: ["text", "json"] as const,
  },
  addressDetails: {
    flags: "--addressdetails <0|1>",
    description: "Include a breakdown of the address (0 or 1).",
    int: true,
  },
  extraTags: {
    flags: "--extratags <0|1>",
    description: "Include extra tags (0 or 1).",
    int: true,
  },
  nameDetails: {
    flags: "--namedetails <0|1>",
    description: "Include a full list of names (0 or 1).",
    int: true,
  },
  entrances: {
    flags: "--entrances <0|1>",
    description: "Include tagged entrances (0 or 1).",
    int: true,
  },
  acceptLanguage: {
    flags: "--accept-language <languages>",
    description: "Preferred language order for results.",
  },
  layer: {
    flags: "--layer <layers>",
    description: "Select places by themes (comma-separated).",
  },
  featureType: {
    flags: "--feature-type <type>",
    description: "Fine-grained address-layer selection.",
    choices: ["country", "state", "city", "settlement"] as const,
  },
  countryCodes: {
    flags: "--country-codes <codes>",
    description: "Restrict results to ISO 3166-1 alpha-2 codes.",
  },
  excludePlaceIds: {
    flags: "--exclude-place-ids <ids>",
    description: "Comma-separated place IDs to skip.",
  },
  viewbox: {
    flags: "--viewbox <x1,y1,x2,y2>",
    description: "Bounding box to focus the search.",
  },
  bounded: {
    flags: "--bounded <0|1>",
    description: "Restrict results to the viewbox (0 or 1).",
    int: true,
  },
  dedupe: {
    flags: "--dedupe <0|1>",
    description: "Enable/disable result deduplication (0 or 1).",
    int: true,
  },
  polygonGeojson: {
    flags: "--polygon-geojson <0|1>",
    description: "Include polygon geometry as GeoJSON (0 or 1).",
    int: true,
  },
  polygonKml: {
    flags: "--polygon-kml <0|1>",
    description: "Include polygon geometry as KML (0 or 1).",
    int: true,
  },
  polygonSvg: {
    flags: "--polygon-svg <0|1>",
    description: "Include polygon geometry as SVG (0 or 1).",
    int: true,
  },
  polygonText: {
    flags: "--polygon-text <0|1>",
    description: "Include polygon geometry as WKT (0 or 1).",
    int: true,
  },
  polygonThreshold: {
    flags: "--polygon-threshold <threshold>",
    description: "Simplification tolerance in degrees.",
  },
  jsonCallback: {
    flags: "--json-callback <name>",
    description: "JSONP callback function name.",
  },
  debug: {
    flags: "--debug <0|1>",
    description: "Output assorted developer debug information (0 or 1).",
    int: true,
  },
  zoom: {
    flags: "--zoom <zoom>",
    description: "Reverse geocoding zoom level (0-18).",
    int: true,
  },
} as const satisfies Record<string, Spec>;

const toOption = (spec: Spec): Option => {
  const parser = spec.int ? (v: string) => Number.parseInt(v, 10) : undefined;
  let option = new Option(spec.flags, spec.description);

  if (spec.choices) {
    option = option.choices([...spec.choices]);
  }

  if (spec.mandatory) {
    option = option.makeOptionMandatory();
  }

  if (parser) {
    option = option.argParser(parser);
  }

  return option;
};

type OptionKey = keyof typeof SPECS;

export type { OptionKey };

export const options = (keys: readonly OptionKey[]): Option[] =>
  keys.map((key) => toOption(SPECS[key]));
