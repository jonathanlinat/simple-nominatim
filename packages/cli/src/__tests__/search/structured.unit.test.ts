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

import { structuredSearch, type OutputFormat } from "@simple-nominatim/core";
import type { MockInstance } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { StructuredArgv } from "../../search/search.types";
import { structuredSearchWrapper } from "../../search/structured";

vi.mock("@simple-nominatim/core");

describe("search:structured", () => {
  const MOCK_ADDRESS = {
    street: "10 Downing Street",
    city: "London",
    country: "United Kingdom",
  };

  const MOCK_RESPONSE = [
    {
      place_id: "12345",
      display_name: "10 Downing Street, London, United Kingdom",
      lat: "51.5033",
      lon: "-0.1276",
    },
  ];

  let consoleLogSpy: MockInstance<typeof console.log>;
  let consoleErrorSpy: MockInstance<typeof console.error>;

  beforeEach(() => {
    vi.clearAllMocks();

    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(structuredSearch).mockResolvedValue(MOCK_RESPONSE);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("core functionality", () => {
    it("should call structuredSearch with address components", async () => {
      const argv: StructuredArgv = {
        street: MOCK_ADDRESS.street,
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        {
          street: MOCK_ADDRESS.street,
          city: MOCK_ADDRESS.city,
          country: MOCK_ADDRESS.country,
          amenity: undefined,
          county: undefined,
          postalcode: undefined,
          state: undefined,
        },
        expect.objectContaining({
          format: "json",
        }),
      );
    });

    it("should output JSON response", async () => {
      const argv: StructuredArgv = {
        street: MOCK_ADDRESS.street,
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
      };

      await structuredSearchWrapper(argv);

      expect(console.log).toHaveBeenCalledWith(JSON.stringify(MOCK_RESPONSE));
    });
  });

  describe("API parameters", () => {
    it("should handle all address components", async () => {
      const argv: StructuredArgv = {
        amenity: "cafe",
        street: "Main Street",
        city: "Paris",
        county: "Île-de-France",
        state: "Île-de-France",
        postalcode: "75001",
        country: "France",
        format: "json",
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          amenity: "cafe",
          street: "Main Street",
          city: "Paris",
          county: "Île-de-France",
          state: "Île-de-France",
          postalcode: "75001",
          country: "France",
        }),
        expect.any(Object),
      );
    });

    it("should handle API parameters", async () => {
      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
        email: "test@example.com",
        limit: 5,
        addressdetails: 1,
        extratags: 1,
        namedetails: 1,
        entrances: 1,
        acceptLanguage: "en",
        countrycodes: "gb,us",
        layer: "address",
        featuretype: "city",
        excludePlaceIds: "123,456",
        viewbox: "-0.2,51.4,-0.1,51.6",
        bounded: 1,
        dedupe: 0,
        debug: 1,
        jsonCallback: "callback",
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          email: "test@example.com",
          format: "json",
          limit: 5,
          addressdetails: 1,
          extratags: 1,
          namedetails: 1,
          entrances: 1,
          "accept-language": "en",
          countrycodes: "gb,us",
          layer: "address",
          featureType: "city",
          exclude_place_ids: "123,456",
          viewbox: "-0.2,51.4,-0.1,51.6",
          bounded: 1,
          dedupe: 0,
          debug: 1,
          json_callback: "callback",
        }),
      );
    });

    it("should handle polygon parameters", async () => {
      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
        polygonGeojson: 1,
        polygonKml: 1,
        polygonSvg: 1,
        polygonText: 1,
        polygonThreshold: 0.001,
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          polygon_geojson: 1,
          polygon_kml: 1,
          polygon_svg: 1,
          polygon_text: 1,
          polygon_threshold: 0.001,
        }),
      );
    });
  });

  describe("configuration builders", () => {
    it("should build cache configuration", async () => {
      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
        cacheTtl: 120000,
        cacheMaxSize: 200,
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          cache: {
            ttl: 120000,
            maxSize: 200,
          },
        }),
      );
    });

    it("should build rate limit configuration", async () => {
      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
        rateLimit: 5,
        rateLimitInterval: 2000,
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          rateLimit: {
            limit: 5,
            interval: 2000,
          },
        }),
      );
    });

    it("should build retry configuration", async () => {
      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
        retryMaxAttempts: 5,
        retryInitialDelay: 2000,
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          retry: {
            maxAttempts: 5,
            initialDelay: 2000,
          },
        }),
      );
    });

    it("should disable cache when noCache is true", async () => {
      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
        noCache: true,
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          cache: {
            enabled: false,
          },
        }),
      );
    });

    it("should disable rate limit when noRateLimit is true", async () => {
      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
        noRateLimit: true,
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          rateLimit: {
            enabled: false,
          },
        }),
      );
    });

    it("should disable retry when noRetry is true", async () => {
      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
        noRetry: true,
      };

      await structuredSearchWrapper(argv);

      expect(structuredSearch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          retry: {
            enabled: false,
          },
        }),
      );
    });
  });

  describe("validation", () => {
    it("should validate output format", async () => {
      const processExitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);
      const consoleErrorSpy = vi.spyOn(console, "error");

      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "invalid" as OutputFormat,
      };

      await structuredSearchWrapper(argv);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(1);

      processExitSpy.mockRestore();
    });
  });

  describe("error handling", () => {
    it("should handle API errors", async () => {
      const processExitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);
      const consoleErrorSpy = vi.spyOn(console, "error");

      vi.mocked(structuredSearch).mockRejectedValue(
        new Error("API Error: Service unavailable"),
      );

      const argv: StructuredArgv = {
        city: MOCK_ADDRESS.city,
        country: MOCK_ADDRESS.country,
        format: "json",
      };

      await structuredSearchWrapper(argv);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("API Error: Service unavailable"),
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);

      processExitSpy.mockRestore();
    });
  });
});
