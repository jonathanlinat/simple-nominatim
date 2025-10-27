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

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { geocodeReverse } from "@simple-nominatim/core";

import { geocodeReverseWrapper } from "../../reverse/geocode";

import type { GeocodeReverseArgv } from "../../reverse/reverse.types";

vi.mock("@simple-nominatim/core", () => ({
  geocodeReverse: vi.fn(),
}));

describe("geocodeReverseWrapper", () => {
  let consoleLogSpy: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(geocodeReverse).mockResolvedValue({
      place_id: "12345",
      lat: "51.5074",
      lon: "-0.1278",
      display_name: "London, UK",
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("delegation and parameter mapping", () => {
    it("should call geocodeReverse with coordinates and options", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
        email: "test@example.com",
        addressdetails: 1,
        extratags: 1,
        namedetails: 1,
        acceptLanguage: "en",
        zoom: 18,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        {
          latitude: "51.5074",
          longitude: "-0.1278",
        },
        expect.objectContaining({
          email: "test@example.com",
          format: "json",
          addressdetails: 1,
          extratags: 1,
          namedetails: 1,
          "accept-language": "en",
          zoom: 18,
        }),
      );
    });

    it("should pass config builder results to core function", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
        noCache: true,
        cacheTtl: 10000,
        noRateLimit: true,
        rateLimit: 1,
        noRetry: true,
        retryMaxAttempts: 3,
      };

      await geocodeReverseWrapper(argv);

      const callArgs = vi.mocked(geocodeReverse).mock.calls[0]?.[1];

      expect(callArgs).toHaveProperty("cache");
      expect(callArgs).toHaveProperty("rateLimit");
      expect(callArgs).toHaveProperty("retry");
    });

    it("should handle entrances parameter", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
        entrances: 1,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          entrances: 1,
        }),
      );
    });

    it("should handle layer parameter", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
        layer: "address,poi",
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          layer: "address,poi",
        }),
      );
    });

    it("should handle polygon options", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
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

    it("should handle debug parameter", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
        debug: 1,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          debug: 1,
        }),
      );
    });
  });

  describe("validation", () => {
    it("should validate input and exit on error", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      const argv: GeocodeReverseArgv = {
        latitude: "invalid",
        longitude: "-0.1278",
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();

      mockExit.mockRestore();
    });
  });

  describe("response handling", () => {
    it("should output successful response to console", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(console.log).toHaveBeenCalledWith(expect.any(String));
    });

    it("should handle API errors", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      vi.mocked(geocodeReverse).mockRejectedValueOnce(
        new Error("API Error: Server not available"),
      );

      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("API Error"),
      );

      mockExit.mockRestore();
    });
  });
});
