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

import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetDataFetcherInstances } from "../../_shared/dataFetcher";
import { freeFormSearch } from "../../search/freeForm";

describe("search:free-form", () => {
  const MOCK_QUERY = "Eiffel Tower, Paris";

  const MOCK_RESPONSE = [
    {
      place_id: 12345,
      display_name: "Eiffel Tower, Paris, France",
      lat: "48.8583736",
      lon: "2.2922926",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    resetDataFetcherInstances();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_RESPONSE,
    });
  });

  describe("core functionality", () => {
    it("should perform free-form search with query", async () => {
      const result = await freeFormSearch(
        { query: MOCK_QUERY },
        { format: "json" },
      );

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should construct URL with query parameter", async () => {
      await freeFormSearch({ query: "Big Ben, London" }, { format: "json" });

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("search?");
      expect(url).toContain("q=Big+Ben%2C+London");
      expect(url).toContain("format=json");
    });
  });

  describe("API parameters", () => {
    it("should include basic API parameters in URL", async () => {
      await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          email: "test@example.com",
          limit: 10,
        },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("email=test%40example.com");
      expect(url).toContain("limit=10");
    });

    it("should include detail parameters in URL", async () => {
      await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          addressdetails: 1,
          extratags: 1,
          namedetails: 1,
          entrances: 1,
        },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("addressdetails=1");
      expect(url).toContain("extratags=1");
      expect(url).toContain("namedetails=1");
      expect(url).toContain("entrances=1");
    });

    it("should include language and location parameters in URL", async () => {
      await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          "accept-language": "fr",
          countrycodes: "fr,de",
          layer: "address,poi",
        },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("accept-language=fr");
      expect(url).toContain("countrycodes=fr%2Cde");
      expect(url).toContain("layer=address%2Cpoi");
    });

    it("should include polygon parameters in URL", async () => {
      await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          polygon_geojson: 1,
          polygon_kml: 1,
          polygon_svg: 1,
          polygon_text: 1,
          polygon_threshold: 0.5,
        },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("polygon_geojson=1");
      expect(url).toContain("polygon_kml=1");
      expect(url).toContain("polygon_svg=1");
      expect(url).toContain("polygon_text=1");
      expect(url).toContain("polygon_threshold=0.5");
    });

    it("should include search filter parameters in URL", async () => {
      await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          featureType: "city",
          exclude_place_ids: "123,456",
          viewbox: "-0.5,51.0,0.5,52.0",
          bounded: 1,
        },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("featureType=city");
      expect(url).toContain("exclude_place_ids=123%2C456");
      expect(url).toContain("viewbox=-0.5%2C51.0%2C0.5%2C52.0");
      expect(url).toContain("bounded=1");
    });

    it("should include output control parameters in URL", async () => {
      await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          debug: 1,
          dedupe: 0,
          json_callback: "myCallback",
        },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("debug=1");
      expect(url).toContain("dedupe=0");
      expect(url).toContain("json_callback=myCallback");
    });

    it("should omit undefined parameters from URL", async () => {
      await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          limit: undefined,
          addressdetails: undefined,
        },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).not.toContain("limit=");
      expect(url).not.toContain("addressdetails=");
    });
  });

  describe("configuration", () => {
    it("should work with cache configuration", async () => {
      const result = await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          cache: { enabled: true, maxSize: 100, ttl: 5000 },
        },
      );

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should work with rate limit configuration", async () => {
      const result = await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          rateLimit: { enabled: true, limit: 5, interval: 1000 },
        },
      );

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should work with retry configuration and retry on failure", async () => {
      let callCount = 0;

      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++;

        if (callCount === 1) {
          throw new Error("Network error");
        }

        return { ok: true, json: async () => MOCK_RESPONSE };
      });

      const result = await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          retry: {
            enabled: true,
            maxAttempts: 2,
            initialDelay: 10,
            useJitter: false,
          },
        },
      );

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it("should work with all configurations combined", async () => {
      const result = await freeFormSearch(
        { query: MOCK_QUERY },
        {
          format: "json",
          cache: { enabled: false, maxSize: 100, ttl: 5000 },
          rateLimit: { enabled: false, limit: 2, interval: 500 },
          retry: {
            enabled: false,
            maxAttempts: 1,
            initialDelay: 100,
            useJitter: false,
          },
        },
      );

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("error handling", () => {
    it("should throw on HTTP error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      await expect(
        freeFormSearch(
          { query: "invalid query" },
          { format: "json", retry: { enabled: false } },
        ),
      ).rejects.toThrow("HTTP error");
    });

    it("should throw on network error", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network failure"));

      await expect(
        freeFormSearch(
          { query: MOCK_QUERY },
          {
            format: "json",
            retry: { enabled: false },
          },
        ),
      ).rejects.toThrow("Network failure");
    });
  });
});
