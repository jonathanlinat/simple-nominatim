// SPDX-License-Identifier: MIT

import type {
  OutputFormat,
  ReverseOptions,
  SearchOptions,
} from "@simple-nominatim/core";

import type { CommonApiArgv, SearchFilterArgv } from "./argv.types";

type SearchArgvInput = CommonApiArgv &
  SearchFilterArgv & {
    email?: string;
    format: OutputFormat;
    limit?: number;
  };

type ReverseArgvInput = CommonApiArgv & {
  email?: string;
  format: OutputFormat;
  zoom?: number;
};

const COMMON_RENAMES = {
  acceptLanguage: "accept-language",
  polygonGeojson: "polygon_geojson",
  polygonKml: "polygon_kml",
  polygonSvg: "polygon_svg",
  polygonText: "polygon_text",
  polygonThreshold: "polygon_threshold",
  jsonCallback: "json_callback",
} as const satisfies Partial<Record<keyof CommonApiArgv, string>>;

const SEARCH_RENAMES = {
  excludePlaceIds: "exclude_place_ids",
} as const satisfies Partial<Record<keyof SearchFilterArgv, string>>;

const pickDefined = <T extends object>(
  source: T,
  keys: readonly (keyof T)[],
  renames: Readonly<Record<string, string>> = {},
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};

  for (const key of keys) {
    const value = source[key];

    if (value !== undefined) {
      out[renames[key as string] ?? (key as string)] = value;
    }
  }

  return out;
};

const COMMON_KEYS = [
  "addressdetails",
  "extratags",
  "namedetails",
  "entrances",
  "debug",
  "layer",
  "acceptLanguage",
  "polygonGeojson",
  "polygonKml",
  "polygonSvg",
  "polygonText",
  "polygonThreshold",
  "jsonCallback",
] as const satisfies readonly (keyof CommonApiArgv)[];

const SEARCH_FILTER_KEYS = [
  "bounded",
  "dedupe",
  "featureType",
  "countrycodes",
  "excludePlaceIds",
  "viewbox",
] as const satisfies readonly (keyof SearchFilterArgv)[];

export const buildCommonApiOptions = (argv: CommonApiArgv) =>
  pickDefined(argv, COMMON_KEYS, COMMON_RENAMES);

export const buildSearchApiOptions = (
  argv: SearchArgvInput,
): SearchOptions => ({
  email: argv.email,
  format: argv.format,
  limit: argv.limit,
  ...buildCommonApiOptions(argv),
  ...pickDefined(argv, SEARCH_FILTER_KEYS, SEARCH_RENAMES),
});

export const buildReverseApiOptions = (
  argv: ReverseArgvInput,
): ReverseOptions => ({
  email: argv.email,
  format: argv.format,
  ...buildCommonApiOptions(argv),
  ...(argv.zoom !== undefined && { zoom: argv.zoom }),
});
