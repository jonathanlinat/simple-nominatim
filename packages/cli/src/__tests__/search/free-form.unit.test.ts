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

import { freeFormSearch } from "@simple-nominatim/core";

import { freeFormSearchWrapper } from "../../search/free-form";

import type { FreeFormArgv } from "../../search/search.types";

vi.mock("@simple-nominatim/core", () => ({
  freeFormSearch: vi.fn(),
}));

describe("freeFormSearchWrapper", () => {
  let consoleLogSpy: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(freeFormSearch).mockResolvedValue([
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
    it("should call freeFormSearch with query params and options", async () => {
      const argv: FreeFormArgv = {
        query: "London",
        format: "json",
        email: "test@example.com",
        limit: 10,
        addressdetails: 1,
        extratags: 1,
        acceptLanguage: "en",
        countrycodes: "gb",
        layer: "address",
        viewbox: "-0.5,51.3,0.5,51.7",
        bounded: 1,
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        { query: "London" },
        expect.objectContaining({
          email: "test@example.com",
          format: "json",
          limit: 10,
          addressdetails: 1,
          extratags: 1,
          "accept-language": "en",
          countrycodes: "gb",
          layer: "address",
          viewbox: "-0.5,51.3,0.5,51.7",
          bounded: 1,
        }),
      );
    });

    it("should pass config builder results to core function", async () => {
      const argv: FreeFormArgv = {
        query: "London",
        format: "json",
        noCache: true,
        cacheTtl: 5000,
        noRateLimit: true,
        rateLimit: 2,
        noRetry: true,
        retryMaxAttempts: 5,
      };

      await freeFormSearchWrapper(argv);

      const callArgs = vi.mocked(freeFormSearch).mock.calls[0]?.[1];

      expect(callArgs).toHaveProperty("cache");
      expect(callArgs).toHaveProperty("rateLimit");
      expect(callArgs).toHaveProperty("retry");
    });

    it("should handle all optional search parameters", async () => {
      const argv: FreeFormArgv = {
        query: "London",
        format: "json",
        namedetails: 1,
        entrances: 1,
        layer: "address,poi",
        featuretype: "city",
        excludePlaceIds: "123,456",
        viewbox: "-0.5,51.0,0.5,52.0",
        bounded: 1,
        polygonGeojson: 1,
        polygonKml: 1,
        polygonSvg: 1,
        polygonText: 1,
        polygonThreshold: 0.01,
        jsonCallback: "callback",
        dedupe: 0,
        debug: 1,
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        expect.objectContaining({
          query: "London",
        }),
        expect.objectContaining({
          format: "json",
          namedetails: 1,
          entrances: 1,
          layer: "address,poi",
          featureType: "city",
          exclude_place_ids: "123,456",
          viewbox: "-0.5,51.0,0.5,52.0",
          bounded: 1,
          polygon_geojson: 1,
          polygon_kml: 1,
          polygon_svg: 1,
          polygon_text: 1,
          polygon_threshold: 0.01,
          json_callback: "callback",
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

      const argv: FreeFormArgv = {
        query: "",
        format: "json",
      };

      await freeFormSearchWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();

      mockExit.mockRestore();
    });
  });

  describe("response handling", () => {
    it("should output successful response to console", async () => {
      const argv: FreeFormArgv = {
        query: "London",
        format: "json",
      };

      await freeFormSearchWrapper(argv);

      expect(console.log).toHaveBeenCalledWith(expect.any(String));
    });

    it("should handle API errors", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      vi.mocked(freeFormSearch).mockRejectedValueOnce(
        new Error("API Error: Server not available"),
      );

      const argv: FreeFormArgv = {
        query: "London",
        format: "json",
      };

      await freeFormSearchWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("API Error"),
      );

      mockExit.mockRestore();
    });
  });
});
