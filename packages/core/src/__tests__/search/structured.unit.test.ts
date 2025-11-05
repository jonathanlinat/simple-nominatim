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
import { structuredSearch } from "../../search/structured";

describe("search:structured", () => {
  const MOCK_ADDRESS = {
    street: "10 Downing Street",
    city: "London",
    country: "United Kingdom",
  };

  const MOCK_RESPONSE = [
    {
      place_id: 12345,
      display_name: "10 Downing Street, London, United Kingdom",
      lat: "51.5033",
      lon: "-0.1276",
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
    it("should perform structured search with address components", async () => {
      const result = await structuredSearch(MOCK_ADDRESS, { format: "json" });

      expect(result).toStrictEqual(MOCK_RESPONSE);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should construct URL with address parameters", async () => {
      await structuredSearch(
        { city: "Paris", country: "France" },
        { format: "json" },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("search?");
      expect(url).toContain("city=Paris");
      expect(url).toContain("country=France");
      expect(url).toContain("format=json");
    });

    it("should handle all address components", async () => {
      await structuredSearch(
        {
          amenity: "cafe",
          street: "Main Street",
          city: "Paris",
          county: "Île-de-France",
          state: "Île-de-France",
          postalcode: "75001",
          country: "France",
        },
        { format: "json" },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("amenity=cafe");
      expect(url).toContain("street=Main+Street");
      expect(url).toContain("city=Paris");
      expect(url).toContain("county=%C3%8Ele-de-France");
      expect(url).toContain("state=%C3%8Ele-de-France");
      expect(url).toContain("postalcode=75001");
      expect(url).toContain("country=France");
    });
  });

  describe("API parameters", () => {
    it("should include basic API parameters in URL", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        email: "test@example.com",
        limit: 10,
      });

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("email=test%40example.com");
      expect(url).toContain("limit=10");
    });

    it("should include detail parameters in URL", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        addressdetails: 1,
        extratags: 1,
        namedetails: 1,
        entrances: 1,
      });

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("addressdetails=1");
      expect(url).toContain("extratags=1");
      expect(url).toContain("namedetails=1");
      expect(url).toContain("entrances=1");
    });

    it("should include location and filter parameters in URL", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        "accept-language": "en",
        countrycodes: "gb,us",
        layer: "address",
        featureType: "city",
        exclude_place_ids: "123,456",
        viewbox: "-0.2,51.4,-0.1,51.6",
        bounded: 1,
      });

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("accept-language=en");
      expect(url).toContain("countrycodes=gb%2Cus");
      expect(url).toContain("layer=address");
      expect(url).toContain("featureType=city");
      expect(url).toContain("exclude_place_ids=123%2C456");
      expect(url).toContain("viewbox=-0.2%2C51.4%2C-0.1%2C51.6");
      expect(url).toContain("bounded=1");
    });

    it("should include polygon parameters in URL", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        polygon_geojson: 1,
        polygon_kml: 1,
        polygon_svg: 1,
        polygon_text: 1,
        polygon_threshold: 0.001,
      });

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("polygon_geojson=1");
      expect(url).toContain("polygon_kml=1");
      expect(url).toContain("polygon_svg=1");
      expect(url).toContain("polygon_text=1");
      expect(url).toContain("polygon_threshold=0.001");
    });

    it("should include additional parameters in URL", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        debug: 1,
        dedupe: 0,
        json_callback: "myCallback",
      });

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const url = callArgs![0] as string;

      expect(url).toContain("debug=1");
      expect(url).toContain("dedupe=0");
      expect(url).toContain("json_callback=myCallback");
    });
  });

  describe("configuration", () => {
    it("should support cache configuration", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        cache: {
          enabled: true,
          ttl: 5000,
          maxSize: 100,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should support rate limit configuration", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        rateLimit: {
          enabled: true,
          limit: 5,
          interval: 1000,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should support retry configuration", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        retry: {
          enabled: true,
          maxAttempts: 3,
          initialDelay: 1000,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should support disabled cache", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        cache: {
          enabled: false,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should support disabled rate limit", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        rateLimit: {
          enabled: false,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should support disabled retry", async () => {
      await structuredSearch(MOCK_ADDRESS, {
        format: "json",
        retry: {
          enabled: false,
        },
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("error handling", () => {
    it("should handle API errors", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(
        structuredSearch(MOCK_ADDRESS, {
          format: "json",
          retry: { enabled: false },
          rateLimit: { interval: 10 },
        }),
      ).rejects.toThrow("HTTP error! Status: 500. Text: Internal Server Error");
    });

    it("should handle network errors", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        structuredSearch(MOCK_ADDRESS, {
          format: "json",
          retry: { enabled: false },
          rateLimit: { interval: 10 },
        }),
      ).rejects.toThrow("Network error");
    });
  });
});
