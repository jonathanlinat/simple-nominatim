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

import { geocodeReverse } from "@simple-nominatim/core";
import type { MockInstance } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { geocodeReverseWrapper } from "../../reverse/geocode";
import type { GeocodeReverseArgv } from "../../reverse/reverse.types";

vi.mock("@simple-nominatim/core", () => ({
  geocodeReverse: vi.fn(),
}));

describe("reverse:geocode", () => {
  const MOCK_COORDINATES = {
    latitude: "51.5074",
    longitude: "-0.1278",
  };

  const MOCK_RESPONSE = {
    place_id: "12345",
    lat: "51.5074",
    lon: "-0.1278",
    display_name: "London, UK",
  };

  let consoleLogSpy: MockInstance<typeof console.log>;
  let consoleErrorSpy: MockInstance<typeof console.error>;

  beforeEach(() => {
    vi.clearAllMocks();

    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(geocodeReverse).mockResolvedValue(MOCK_RESPONSE);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("core functionality", () => {
    it("should call geocodeReverse with coordinates and format", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        {
          latitude: MOCK_COORDINATES.latitude,
          longitude: MOCK_COORDINATES.longitude,
        },
        expect.objectContaining({
          format: "json",
        }),
      );
    });

    it("should output response to console", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("API parameters", () => {
    it("should pass basic API parameters", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
        email: "test@example.com",
        addressdetails: 1,
        zoom: 18,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          email: "test@example.com",
          addressdetails: 1,
          zoom: 18,
        }),
      );
    });

    it("should pass additional detail parameters", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
        extratags: 1,
        namedetails: 1,
        entrances: 1,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          extratags: 1,
          namedetails: 1,
          entrances: 1,
        }),
      );
    });

    it("should pass layer and debug parameters", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
        layer: "address,poi",
        debug: 1,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          layer: "address,poi",
          debug: 1,
        }),
      );
    });

    it("should pass all polygon format parameters", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
        polygonGeojson: 1,
        polygonKml: 1,
        polygonSvg: 1,
        polygonText: 1,
        polygonThreshold: 0.5,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          polygon_geojson: 1,
          polygon_kml: 1,
          polygon_svg: 1,
          polygon_text: 1,
          polygon_threshold: 0.5,
        }),
      );
    });

    it("should transform CLI parameter names to API format", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
        acceptLanguage: "en",
        polygonGeojson: 1,
        jsonCallback: "myCallback",
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          "accept-language": "en",
          polygon_geojson: 1,
          json_callback: "myCallback",
        }),
      );
    });

    it("should omit undefined optional parameters", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
        zoom: undefined,
        addressdetails: undefined,
        email: undefined,
      };

      await geocodeReverseWrapper(argv);

      expect(geocodeReverse).toHaveBeenCalled();
    });
  });

  describe("configuration builders", () => {
    it("should build and pass cache configuration", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
        noCache: true,
        cacheTtl: 5000,
        cacheMaxSize: 200,
      };

      await geocodeReverseWrapper(argv);

      const callArgs = vi.mocked(geocodeReverse).mock.calls[0]?.[1];

      expect(callArgs).toHaveProperty("cache");
      expect(callArgs?.cache).toMatchObject({
        enabled: false,
        ttl: 5000,
        maxSize: 200,
      });
    });

    it("should build and pass rate limit configuration", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
        noRateLimit: true,
        rateLimit: 5,
        rateLimitInterval: 2000,
      };

      await geocodeReverseWrapper(argv);

      const callArgs = vi.mocked(geocodeReverse).mock.calls[0]?.[1];

      expect(callArgs).toHaveProperty("rateLimit");
      expect(callArgs?.rateLimit).toMatchObject({
        enabled: false,
        limit: 5,
        interval: 2000,
      });
    });

    it("should build and pass retry configuration", async () => {
      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
        noRetry: true,
        retryMaxAttempts: 3,
        retryInitialDelay: 500,
      };

      await geocodeReverseWrapper(argv);

      const callArgs = vi.mocked(geocodeReverse).mock.calls[0]?.[1];

      expect(callArgs).toHaveProperty("retry");
      expect(callArgs?.retry).toMatchObject({
        enabled: false,
        maxAttempts: 3,
        initialDelay: 500,
      });
    });
  });

  describe("validation", () => {
    it("should validate coordinates and exit on invalid latitude", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      const argv: GeocodeReverseArgv = {
        latitude: "invalid",
        longitude: MOCK_COORDINATES.longitude,
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalled();

      mockExit.mockRestore();
    });
  });

  describe("error handling", () => {
    it("should handle API errors gracefully", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      vi.mocked(geocodeReverse).mockRejectedValueOnce(
        new Error("API Error: Server unavailable"),
      );

      const argv: GeocodeReverseArgv = {
        ...MOCK_COORDINATES,
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalled();

      mockExit.mockRestore();
    });
  });
});
