// SPDX-License-Identifier: MIT

export interface CommonApiArgv {
  addressdetails?: 0 | 1;
  extratags?: 0 | 1;
  namedetails?: 0 | 1;
  entrances?: 0 | 1;
  acceptLanguage?: string;
  layer?: string;
  polygonGeojson?: 0 | 1;
  polygonKml?: 0 | 1;
  polygonSvg?: 0 | 1;
  polygonText?: 0 | 1;
  polygonThreshold?: number;
  jsonCallback?: string;
  debug?: 0 | 1;
}

export interface SearchFilterArgv {
  countrycodes?: string;
  featureType?: "country" | "state" | "city" | "settlement";
  excludePlaceIds?: string;
  viewbox?: string;
  bounded?: 0 | 1;
  dedupe?: 0 | 1;
}
