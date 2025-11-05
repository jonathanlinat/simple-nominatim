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

import { freeFormSearch } from "@simple-nominatim/core";
import type { MockInstance } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { freeFormSearchWrapper } from "../../search/freeForm";
import type { FreeFormArgv } from "../../search/search.types";

vi.mock("@simple-nominatim/core", () => ({
  freeFormSearch: vi.fn(),
}));

describe("search:free-form", () => {
  const MOCK_QUERY = "Eiffel Tower, Paris";

  const MOCK_RESPONSE = [
    {
      place_id: "12345",
      lat: "48.8583736",
      lon: "2.2922926",
      display_name: "Eiffel Tower, Paris, France",
    },
  ];

  let consoleLogSpy: MockInstance<typeof console.log>;
  let consoleErrorSpy: MockInstance<typeof console.error>;

  beforeEach(() => {
    vi.clearAllMocks();

    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(freeFormSearch).mockResolvedValue(MOCK_RESPONSE);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("core functionality", () => {
    it("should perform free-form search with query", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({ format: "json" }),
      );
    });

    it("should output results to console", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
      };

      await freeFormSearchWrapper(argv);

      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(MOCK_RESPONSE));
    });
  });

  describe("API parameters", () => {
    it("should include email and limit parameters", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
        email: "test@example.com",
        limit: 10,
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({
          email: "test@example.com",
          limit: 10,
        }),
      );
    });

    it("should include detail parameters", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
        addressdetails: 1,
        extratags: 1,
        namedetails: 1,
        entrances: 1,
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({
          addressdetails: 1,
          extratags: 1,
          namedetails: 1,
          entrances: 1,
        }),
      );
    });

    it("should include language and location parameters", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
        acceptLanguage: "fr",
        countrycodes: "fr,de",
        layer: "address,poi",
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({
          "accept-language": "fr",
          countrycodes: "fr,de",
          layer: "address,poi",
        }),
      );
    });

    it("should include polygon parameters", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
        polygonGeojson: 1,
        polygonKml: 1,
        polygonSvg: 1,
        polygonText: 1,
        polygonThreshold: 0.5,
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({
          polygon_geojson: 1,
          polygon_kml: 1,
          polygon_svg: 1,
          polygon_text: 1,
          polygon_threshold: 0.5,
        }),
      );
    });

    it("should include search filter parameters", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
        featuretype: "city",
        excludePlaceIds: "123,456",
        viewbox: "-0.5,51.0,0.5,52.0",
        bounded: 1,
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({
          featureType: "city",
          exclude_place_ids: "123,456",
          viewbox: "-0.5,51.0,0.5,52.0",
          bounded: 1,
        }),
      );
    });

    it("should include output control parameters", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
        debug: 1,
        dedupe: 0,
        jsonCallback: "myCallback",
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({
          debug: 1,
          dedupe: 0,
          json_callback: "myCallback",
        }),
      );
    });
  });

  describe("configuration builders", () => {
    it("should build cache configuration", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
        cacheTtl: 5000,
        cacheMaxSize: 100,
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({
          cache: {
            ttl: 5000,
            maxSize: 100,
          },
        }),
      );
    });

    it("should build rate limit configuration", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
        rateLimit: 5,
        rateLimitInterval: 1000,
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({
          rateLimit: {
            limit: 5,
            interval: 1000,
          },
        }),
      );
    });

    it("should build retry configuration", async () => {
      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
        retryMaxAttempts: 3,
        retryInitialDelay: 1000,
      };

      await freeFormSearchWrapper(argv);

      expect(freeFormSearch).toHaveBeenCalledWith(
        { query: MOCK_QUERY },
        expect.objectContaining({
          retry: {
            maxAttempts: 3,
            initialDelay: 1000,
          },
        }),
      );
    });
  });

  describe("validation", () => {
    it("should validate required query parameter", async () => {
      const processExitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      const argv = {
        format: "json",
      } as FreeFormArgv;

      await freeFormSearchWrapper(argv);

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

      vi.mocked(freeFormSearch).mockRejectedValue(
        new Error("API request failed"),
      );

      const argv: FreeFormArgv = {
        query: MOCK_QUERY,
        format: "json",
      };

      await freeFormSearchWrapper(argv);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("API request failed"),
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);

      processExitSpy.mockRestore();
    });
  });
});
