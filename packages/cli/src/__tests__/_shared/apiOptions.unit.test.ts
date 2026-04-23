// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import {
  buildCommonApiOptions,
  buildReverseApiOptions,
  buildSearchApiOptions,
} from "../../_shared/apiOptions";

describe("_shared/apiOptions", () => {
  describe("buildCommonApiOptions", () => {
    it("renames camelCase flags to snake_case/hyphenated parameters", () => {
      expect(
        buildCommonApiOptions({
          acceptLanguage: "en",
          polygonGeojson: 1,
          polygonKml: 1,
          polygonSvg: 1,
          polygonText: 1,
          polygonThreshold: 0.5,
          jsonCallback: "cb",
        }),
      ).toStrictEqual({
        "accept-language": "en",
        polygon_geojson: 1,
        polygon_kml: 1,
        polygon_svg: 1,
        polygon_text: 1,
        polygon_threshold: 0.5,
        json_callback: "cb",
      });
    });

    it("forwards detail flags verbatim and omits undefined", () => {
      expect(
        buildCommonApiOptions({
          addressdetails: 1,
          extratags: 1,
          namedetails: 1,
          entrances: 1,
          debug: 1,
          layer: "poi",
        }),
      ).toStrictEqual({
        addressdetails: 1,
        extratags: 1,
        namedetails: 1,
        entrances: 1,
        debug: 1,
        layer: "poi",
      });

      expect(buildCommonApiOptions({})).toStrictEqual({});
    });
  });

  describe("buildSearchApiOptions", () => {
    it("maps search-specific fields and renames excludePlaceIds", () => {
      expect(
        buildSearchApiOptions({
          format: "json",
          email: "a@b.c",
          limit: 10,
          featureType: "city",
          countrycodes: "fr",
          excludePlaceIds: "1,2",
          viewbox: "0,0,1,1",
          bounded: 1,
          dedupe: 0,
        }),
      ).toMatchObject({
        format: "json",
        email: "a@b.c",
        limit: 10,
        featureType: "city",
        countrycodes: "fr",
        exclude_place_ids: "1,2",
        viewbox: "0,0,1,1",
        bounded: 1,
        dedupe: 0,
      });
    });
  });

  describe("buildReverseApiOptions", () => {
    it("maps reverse-specific fields", () => {
      expect(
        buildReverseApiOptions({
          format: "json",
          zoom: 18,
          acceptLanguage: "fr",
        }),
      ).toMatchObject({
        format: "json",
        zoom: 18,
        "accept-language": "fr",
      });
    });
  });
});
