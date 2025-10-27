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

import { structuredSearch } from "../../search/structured";

describe("structuredSearch", () => {
  const mockResponse = [
    {
      place_id: 123,
      display_name: "10 Downing Street, London, UK",
      lat: "51.5034",
      lon: "-0.1276",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    // @ts-expect-error - Overriding global fetch for testing
    global.fetch = undefined;
  });

  describe("basic functionality", () => {
    it("should perform structured search with city", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await structuredSearch(
        { city: "London" },
        { format: "json" },
      );

      expect(result).toStrictEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should construct URL with city parameter", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await structuredSearch({ city: "New York" }, { format: "json" });

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      const url = callArgs![0] as string;
      expect(url).toContain("search?");
      expect(url).toContain("city=New+York");
    });

    it("should return array of results", async () => {
      const customResponse = [
        { place_id: 1, display_name: "Place 1" },
        { place_id: 2, display_name: "Place 2" },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => customResponse,
      });

      const result = await structuredSearch(
        { city: "Paris" },
        { format: "json" },
      );

      expect(result).toStrictEqual(customResponse);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("structured parameters", () => {
    it("should include all address components in URL", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await structuredSearch(
        {
          street: "10 Downing Street",
          city: "London",
          county: "Greater London",
          state: "England",
          postalcode: "SW1A 2AA",
          country: "United Kingdom",
        },
        { format: "json" },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      const url = callArgs![0] as string;
      expect(url).toContain("street=10+Downing+Street");
      expect(url).toContain("city=London");
      expect(url).toContain("county=Greater+London");
      expect(url).toContain("state=England");
      expect(url).toContain("postalcode=SW1A+2AA");
      expect(url).toContain("country=United+Kingdom");
    });
  });

  describe("search options", () => {
    it("should handle optional parameters correctly", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await structuredSearch(
        { city: "London" },
        { format: "json", limit: 5, addressdetails: 1 },
      );

      let callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      let url = callArgs![0] as string;
      expect(url).toContain("limit=5");
      expect(url).toContain("addressdetails=1");

      vi.clearAllMocks();
      await structuredSearch(
        {
          city: "Paris",
          street: undefined,
          amenity: undefined,
        },
        { format: "json", limit: undefined, zoom: undefined },
      );

      callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      url = callArgs![0] as string;
      expect(url).toContain("city=Paris");
      expect(url).not.toContain("street=");
      expect(url).not.toContain("amenity=");
      expect(url).not.toContain("limit=");
      expect(url).not.toContain("zoom=");
    });
  });

  describe("cache options", () => {
    it("should work with cache configuration", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await structuredSearch(
        { city: "London" },
        { format: "json", cache: { enabled: false, maxSize: 200 } },
      );

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("rate limit options", () => {
    it("should work with rate limit configuration", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await structuredSearch(
        { city: "London" },
        { format: "json", rateLimit: { enabled: false, limit: 3 } },
      );

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("retry options", () => {
    it("should work with retry configuration", async () => {
      let callCount = 0;
      global.fetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error("Network error");
        }

        return { ok: true, json: async () => mockResponse };
      });

      const result = await structuredSearch(
        { city: "London" },
        {
          format: "json",
          retry: {
            enabled: true,
            maxAttempts: 2,
            initialDelay: 10,
            useJitter: false,
          },
          rateLimit: { enabled: false },
        },
      );

      expect(result).toStrictEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(2);
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
        structuredSearch(
          { city: "invalid" },
          { format: "json", retry: { enabled: false } },
        ),
      ).rejects.toThrow("HTTP error");
    });

    it("should throw on network error", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network failure"));

      await expect(
        structuredSearch(
          { city: "London" },
          { format: "json", retry: { enabled: false } },
        ),
      ).rejects.toThrow("Network failure");
    });
  });

  describe("integration", () => {
    it("should work with all options combined", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await structuredSearch(
        {
          street: "10 Downing Street",
          city: "London",
          country: "United Kingdom",
        },
        {
          format: "json",
          limit: 5,
          addressdetails: 1,
          cache: { enabled: true },
          rateLimit: { enabled: true },
          retry: { enabled: true },
        },
      );

      expect(result).toStrictEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
