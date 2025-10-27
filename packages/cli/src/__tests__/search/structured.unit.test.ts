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

import { structuredSearch } from "@simple-nominatim/core";

import { structuredSearchWrapper } from "../../search/structured";

import type { StructuredArgv } from "../../search/search.types";

vi.mock("@simple-nominatim/core", () => ({
  structuredSearch: vi.fn(),
}));

describe("structuredSearchWrapper", () => {
  let consoleLogSpy: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(structuredSearch).mockResolvedValue([
      {
        place_id: "12345",
        lat: "51.5074",
        lon: "-0.1278",
        display_name: "London, UK",
      },
    ]);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("delegation and parameter mapping", () => {
    it("should call structuredSearch with address params and options", async () => {
      const argv: StructuredArgv = {
        country: "UK",
        city: "London",
        street: "Baker Street",
        postalcode: "NW1",
        format: "json",
        email: "test@example.com",
        limit: 10,
        addressdetails: 1,
        extratags: 1,
        acceptLanguage: "en",
        countrycodes: "gb",
        layer: "address",
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        {
          country: "UK",
          city: "London",
          street: "Baker Street",
          postalcode: "NW1",
        },
        expect.objectContaining({
          email: "test@example.com",
          format: "json",
          limit: 10,
          addressdetails: 1,
          extratags: 1,
          "accept-language": "en",
          countrycodes: "gb",
          layer: "address",
        }),
      );
    });

    it("should pass config builder results to core function", async () => {
      const argv: StructuredArgv = {
        country: "UK",
        format: "json",
        noCache: true,
        cacheTtl: 6000,
        noRateLimit: true,
        rateLimit: 3,
        noRetry: true,
        retryMaxAttempts: 4,
      };

      await structuredSearchWrapper(argv);

      const callArgs = vi.mocked(structuredSearch).mock.calls[0]?.[1];

      expect(callArgs).toHaveProperty("cache");
      expect(callArgs).toHaveProperty("rateLimit");
      expect(callArgs).toHaveProperty("retry");
    });

    it("should handle all optional search parameters", async () => {
      const argv: StructuredArgv = {
        city: "London",
        format: "json",
        namedetails: 1,
        entrances: 1,
        layer: "address,poi",
        featuretype: "city",
        excludePlaceIds: "789,012",
        viewbox: "-1.0,50.0,1.0,53.0",
        bounded: 1,
        polygonGeojson: 1,
        polygonKml: 1,
        polygonSvg: 1,
        polygonText: 1,
        polygonThreshold: 0.02,
        jsonCallback: "myCallback",
        dedupe: 0,
        debug: 1,
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.objectContaining({
          city: "London",
        }),
        expect.objectContaining({
          format: "json",
          namedetails: 1,
          entrances: 1,
          layer: "address,poi",
          featureType: "city",
          exclude_place_ids: "789,012",
          viewbox: "-1.0,50.0,1.0,53.0",
          bounded: 1,
          polygon_geojson: 1,
          polygon_kml: 1,
          polygon_svg: 1,
          polygon_text: 1,
          polygon_threshold: 0.02,
          json_callback: "myCallback",
          dedupe: 0,
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

      const argv: StructuredArgv = {
        format: "invalid" as "json",
      };

      await structuredSearchWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();

      mockExit.mockRestore();
    });
  });

  describe("response handling", () => {
    it("should output successful response to console", async () => {
      const argv: StructuredArgv = {
        country: "UK",
        city: "London",
        format: "json",
      };

      await structuredSearchWrapper(argv);

      expect(console.log).toHaveBeenCalledWith(expect.any(String));
    });

    it("should handle API errors", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      vi.mocked(structuredSearch).mockRejectedValueOnce(
        new Error("API Error: Server not available"),
      );

      const argv: StructuredArgv = {
        country: "UK",
        city: "London",
        format: "json",
      };

      await structuredSearchWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("API Error"),
      );

      mockExit.mockRestore();
    });
  });
});
