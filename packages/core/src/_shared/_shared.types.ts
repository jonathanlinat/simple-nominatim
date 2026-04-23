// SPDX-License-Identifier: MIT

export type OutputFormat =
  | "xml"
  | "json"
  | "jsonv2"
  | "geojson"
  | "geocodejson";

export interface BaseOptions {
  email?: string;
  format: OutputFormat;
  baseUrl?: string;
  userAgent?: string;
  addressdetails?: 0 | 1;
  extratags?: 0 | 1;
  namedetails?: 0 | 1;
  "accept-language"?: string;
  debug?: 0 | 1;
  entrances?: 0 | 1;
  layer?: string;
  polygon_geojson?: 0 | 1;
  polygon_kml?: 0 | 1;
  polygon_svg?: 0 | 1;
  polygon_text?: 0 | 1;
  polygon_threshold?: number;
  json_callback?: string;
}

export interface SearchOptions extends BaseOptions {
  limit?: number;
  countrycodes?: string;
  featureType?: "country" | "state" | "city" | "settlement";
  exclude_place_ids?: string;
  viewbox?: string;
  bounded?: 0 | 1;
  dedupe?: 0 | 1;
}

export interface ReverseOptions extends BaseOptions {
  zoom?: number;
}
