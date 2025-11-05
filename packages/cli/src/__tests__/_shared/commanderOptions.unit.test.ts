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

import { describe, expect, it } from "vitest";

import {
  acceptLanguageOption,
  addressDetailsOption,
  amenityOption,
  boundedOption,
  cacheMaxSizeOption,
  cacheTtlOption,
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
  latitudeOption,
  layerOption,
  limitOption,
  longitudeOption,
  nameDetailsOption,
  noCacheOption,
  noRateLimitOption,
  noRetryOption,
  outputFormatOption,
  polygonGeojsonOption,
  polygonKmlOption,
  polygonSvgOption,
  polygonTextOption,
  polygonThresholdOption,
  postalCodeOption,
  queryOption,
  rateLimitIntervalOption,
  rateLimitOption,
  retryInitialDelayOption,
  retryMaxAttemptsOption,
  stateOption,
  statusFormatOption,
  streetOption,
  viewboxOption,
  zoomOption,
} from "../../_shared/commanderOptions";

describe("shared:commander-options", () => {
  describe("search parameters", () => {
    it("should export queryOption with correct configuration", () => {
      expect(queryOption).toBeDefined();
      expect(queryOption.flags).toBe("-q, --query <query>");
      expect(queryOption.description).toContain("free-form query string");
      expect(queryOption.mandatory).toBe(true);
    });

    it("should export amenityOption with correct configuration", () => {
      expect(amenityOption).toBeDefined();
      expect(amenityOption.flags).toBe("--amenity <amenity>");
      expect(amenityOption.description).toContain("point of interest");
    });

    it("should export cityOption with correct configuration", () => {
      expect(cityOption).toBeDefined();
      expect(cityOption.flags).toBe("--city <city>");
      expect(cityOption.description).toContain("city name");
    });

    it("should export countryOption with correct configuration", () => {
      expect(countryOption).toBeDefined();
      expect(countryOption.flags).toBe("--country <country>");
      expect(countryOption.description).toContain("country name");
    });

    it("should export countyOption with correct configuration", () => {
      expect(countyOption).toBeDefined();
      expect(countyOption.flags).toBe("--county <county>");
      expect(countyOption.description).toContain("county name");
    });

    it("should export postalCodeOption with correct configuration", () => {
      expect(postalCodeOption).toBeDefined();
      expect(postalCodeOption.flags).toBe("--postal-code <postalCode>");
      expect(postalCodeOption.description).toContain("postal code");
    });

    it("should export stateOption with correct configuration", () => {
      expect(stateOption).toBeDefined();
      expect(stateOption.flags).toBe("--state <state>");
      expect(stateOption.description).toContain("state name");
    });

    it("should export streetOption with correct configuration", () => {
      expect(streetOption).toBeDefined();
      expect(streetOption.flags).toBe("--street <street>");
      expect(streetOption.description).toContain("house number");
    });
  });

  describe("reverse geocoding parameters", () => {
    it("should export latitudeOption with correct configuration", () => {
      expect(latitudeOption).toBeDefined();
      expect(latitudeOption.flags).toBe("--latitude <latitude>");
      expect(latitudeOption.description).toContain("latitude");
      expect(latitudeOption.mandatory).toBe(true);
    });

    it("should export longitudeOption with correct configuration", () => {
      expect(longitudeOption).toBeDefined();
      expect(longitudeOption.flags).toBe("--longitude <longitude>");
      expect(longitudeOption.description).toContain("longitude");
      expect(longitudeOption.mandatory).toBe(true);
    });

    it("should export zoomOption with correct configuration", () => {
      expect(zoomOption).toBeDefined();
      expect(zoomOption.flags).toBe("--zoom <zoom>");
      expect(zoomOption.description).toContain("Level of detail");
    });
  });

  describe("format parameters", () => {
    it("should export outputFormatOption with correct configuration", () => {
      expect(outputFormatOption).toBeDefined();
      expect(outputFormatOption.flags).toBe("-f, --format <format>");
      expect(outputFormatOption.description).toContain("output format");
      expect(outputFormatOption.mandatory).toBe(true);
      expect(outputFormatOption.argChoices).toStrictEqual([
        "xml",
        "json",
        "jsonv2",
        "geojson",
        "geocodejson",
      ]);
    });

    it("should export statusFormatOption with correct configuration", () => {
      expect(statusFormatOption).toBeDefined();
      expect(statusFormatOption.flags).toBe("-f, --format <format>");
      expect(statusFormatOption.description).toContain("output format");
      expect(statusFormatOption.mandatory).toBe(true);
      expect(statusFormatOption.argChoices).toStrictEqual(["text", "json"]);
    });
  });

  describe("API parameters", () => {
    it("should export emailOption with correct configuration", () => {
      expect(emailOption).toBeDefined();
      expect(emailOption.flags).toBe("-e, --email <email>");
      expect(emailOption.description).toContain("email address");
    });

    it("should export limitOption with correct configuration", () => {
      expect(limitOption).toBeDefined();
      expect(limitOption.flags).toBe("--limit <limit>");
      expect(limitOption.description).toContain("maximum number");
    });
  });

  describe("cache configuration options", () => {
    it("should export noCacheOption with correct configuration", () => {
      expect(noCacheOption).toBeDefined();
      expect(noCacheOption.flags).toBe("--no-cache");
      expect(noCacheOption.description).toContain("Disable response caching");
    });

    it("should export cacheTtlOption with correct configuration", () => {
      expect(cacheTtlOption).toBeDefined();
      expect(cacheTtlOption.flags).toBe("--cache-ttl <cacheTtl>");
      expect(cacheTtlOption.description).toContain("time-to-live");
    });

    it("should export cacheMaxSizeOption with correct configuration", () => {
      expect(cacheMaxSizeOption).toBeDefined();
      expect(cacheMaxSizeOption.flags).toBe("--cache-max-size <cacheMaxSize>");
      expect(cacheMaxSizeOption.description).toContain("Maximum number");
    });
  });

  describe("rate limit configuration options", () => {
    it("should export noRateLimitOption with correct configuration", () => {
      expect(noRateLimitOption).toBeDefined();
      expect(noRateLimitOption.flags).toBe("--no-rate-limit");
      expect(noRateLimitOption.description).toContain("Disable rate limiting");
    });

    it("should export rateLimitOption with correct configuration", () => {
      expect(rateLimitOption).toBeDefined();
      expect(rateLimitOption.flags).toBe("--rate-limit <limit>");
      expect(rateLimitOption.description).toContain("Maximum number");
    });

    it("should export rateLimitIntervalOption with correct configuration", () => {
      expect(rateLimitIntervalOption).toBeDefined();
      expect(rateLimitIntervalOption.flags).toBe(
        "--rate-limit-interval <rateLimitInterval>",
      );
      expect(rateLimitIntervalOption.description).toContain("Time interval");
    });
  });

  describe("retry configuration options", () => {
    it("should export noRetryOption with correct configuration", () => {
      expect(noRetryOption).toBeDefined();
      expect(noRetryOption.flags).toBe("--no-retry");
      expect(noRetryOption.description).toContain("Disable retry logic");
    });

    it("should export retryMaxAttemptsOption with correct configuration", () => {
      expect(retryMaxAttemptsOption).toBeDefined();
      expect(retryMaxAttemptsOption.flags).toBe(
        "--retry-max-attempts <retryMaxAttempts>",
      );
      expect(retryMaxAttemptsOption.description).toContain("Maximum number");
    });

    it("should export retryInitialDelayOption with correct configuration", () => {
      expect(retryInitialDelayOption).toBeDefined();
      expect(retryInitialDelayOption.flags).toBe(
        "--retry-initial-delay <retryInitialDelay>",
      );
      expect(retryInitialDelayOption.description).toContain("Initial delay");
    });
  });

  describe("address detail options", () => {
    it("should export addressDetailsOption with correct configuration", () => {
      expect(addressDetailsOption).toBeDefined();
      expect(addressDetailsOption.flags).toBe(
        "--addressdetails <addressdetails>",
      );
      expect(addressDetailsOption.description).toContain("breakdown");
      expect(addressDetailsOption.argChoices).toStrictEqual(["0", "1"]);
    });

    it("should export extraTagsOption with correct configuration", () => {
      expect(extraTagsOption).toBeDefined();
      expect(extraTagsOption.flags).toBe("--extratags <extratags>");
      expect(extraTagsOption.description).toContain("additional information");
      expect(extraTagsOption.argChoices).toStrictEqual(["0", "1"]);
    });

    it("should export nameDetailsOption with correct configuration", () => {
      expect(nameDetailsOption).toBeDefined();
      expect(nameDetailsOption.flags).toBe("--namedetails <namedetails>");
      expect(nameDetailsOption.description).toContain("full list of names");
      expect(nameDetailsOption.argChoices).toStrictEqual(["0", "1"]);
    });

    it("should export entrancesOption with correct configuration", () => {
      expect(entrancesOption).toBeDefined();
      expect(entrancesOption.flags).toBe("--entrances <entrances>");
      expect(entrancesOption.description).toContain("tagged entrances");
      expect(entrancesOption.argChoices).toStrictEqual(["0", "1"]);
    });
  });

  describe("filtering options", () => {
    it("should export acceptLanguageOption with correct configuration", () => {
      expect(acceptLanguageOption).toBeDefined();
      expect(acceptLanguageOption.flags).toBe(
        "--accept-language <acceptLanguage>",
      );
      expect(acceptLanguageOption.description).toContain("Preferred language");
    });

    it("should export countryCodesOption with correct configuration", () => {
      expect(countryCodesOption).toBeDefined();
      expect(countryCodesOption.flags).toBe("--countrycodes <countrycodes>");
      expect(countryCodesOption.description).toContain("Limit search results");
    });

    it("should export layerOption with correct configuration", () => {
      expect(layerOption).toBeDefined();
      expect(layerOption.flags).toBe("--layer <layer>");
      expect(layerOption.description).toContain("Select places by themes");
    });

    it("should export featureTypeOption with correct configuration", () => {
      expect(featureTypeOption).toBeDefined();
      expect(featureTypeOption.flags).toBe("--featuretype <featuretype>");
      expect(featureTypeOption.description).toContain("Fine-grained selection");
      expect(featureTypeOption.argChoices).toStrictEqual([
        "country",
        "state",
        "city",
        "settlement",
      ]);
    });

    it("should export excludePlaceIdsOption with correct configuration", () => {
      expect(excludePlaceIdsOption).toBeDefined();
      expect(excludePlaceIdsOption.flags).toBe(
        "--exclude-place-ids <excludePlaceIds>",
      );
      expect(excludePlaceIdsOption.description).toContain("place_ids to skip");
    });
  });

  describe("bounding box options", () => {
    it("should export viewboxOption with correct configuration", () => {
      expect(viewboxOption).toBeDefined();
      expect(viewboxOption.flags).toBe("--viewbox <viewbox>");
      expect(viewboxOption.description).toContain("Bounding box");
    });

    it("should export boundedOption with correct configuration", () => {
      expect(boundedOption).toBeDefined();
      expect(boundedOption.flags).toBe("--bounded <bounded>");
      expect(boundedOption.description).toContain("Restrict results");
      expect(boundedOption.argChoices).toStrictEqual(["0", "1"]);
    });
  });

  describe("polygon geometry options", () => {
    it("should export polygonGeojsonOption with correct configuration", () => {
      expect(polygonGeojsonOption).toBeDefined();
      expect(polygonGeojsonOption.flags).toBe(
        "--polygon-geojson <polygonGeojson>",
      );
      expect(polygonGeojsonOption.description).toContain("GeoJSON");
      expect(polygonGeojsonOption.argChoices).toStrictEqual(["0", "1"]);
    });

    it("should export polygonKmlOption with correct configuration", () => {
      expect(polygonKmlOption).toBeDefined();
      expect(polygonKmlOption.flags).toBe("--polygon-kml <polygonKml>");
      expect(polygonKmlOption.description).toContain("KML");
      expect(polygonKmlOption.argChoices).toStrictEqual(["0", "1"]);
    });

    it("should export polygonSvgOption with correct configuration", () => {
      expect(polygonSvgOption).toBeDefined();
      expect(polygonSvgOption.flags).toBe("--polygon-svg <polygonSvg>");
      expect(polygonSvgOption.description).toContain("SVG");
      expect(polygonSvgOption.argChoices).toStrictEqual(["0", "1"]);
    });

    it("should export polygonTextOption with correct configuration", () => {
      expect(polygonTextOption).toBeDefined();
      expect(polygonTextOption.flags).toBe("--polygon-text <polygonText>");
      expect(polygonTextOption.description).toContain("WKT");
      expect(polygonTextOption.argChoices).toStrictEqual(["0", "1"]);
    });

    it("should export polygonThresholdOption with correct configuration", () => {
      expect(polygonThresholdOption).toBeDefined();
      expect(polygonThresholdOption.flags).toBe(
        "--polygon-threshold <polygonThreshold>",
      );
      expect(polygonThresholdOption.description).toContain("Tolerance");
    });
  });

  describe("miscellaneous options", () => {
    it("should export jsonCallbackOption with correct configuration", () => {
      expect(jsonCallbackOption).toBeDefined();
      expect(jsonCallbackOption.flags).toBe("--json-callback <jsonCallback>");
      expect(jsonCallbackOption.description).toContain("JSONP callback");
    });

    it("should export dedupeOption with correct configuration", () => {
      expect(dedupeOption).toBeDefined();
      expect(dedupeOption.flags).toBe("--dedupe <dedupe>");
      expect(dedupeOption.description).toContain("deduplication");
      expect(dedupeOption.argChoices).toStrictEqual(["0", "1"]);
    });

    it("should export debugOption with correct configuration", () => {
      expect(debugOption).toBeDefined();
      expect(debugOption.flags).toBe("--debug <debug>");
      expect(debugOption.description).toContain("debug information");
      expect(debugOption.argChoices).toStrictEqual(["0", "1"]);
    });
  });
});
