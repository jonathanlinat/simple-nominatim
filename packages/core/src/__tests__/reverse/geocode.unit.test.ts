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

import { geocodeReverse } from "../../reverse/geocode";

describe("geocodeReverse", () => {
  const mockResponse = {
    place_id: 123,
    display_name: "Test Location",
    address: {
      city: "London",
      country: "United Kingdom",
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    // @ts-expect-error - Overriding global fetch for testing
    global.fetch = undefined;
  });

  describe("basic functionality", () => {
    it("should perform reverse geocoding with coordinates", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geocodeReverse(
        { latitude: "51.5074", longitude: "-0.1278" },
        { format: "json" },
      );

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should construct URL with latitude and longitude", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await geocodeReverse(
        { latitude: "40.7128", longitude: "-74.0060" },
        { format: "json" },
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      const url = callArgs![0] as string;
      expect(url).toContain("reverse?");
      expect(url).toContain("lat=40.7128");
      expect(url).toContain("lon=-74.0060");
    });

    it("should return parsed response", async () => {
      const customResponse = {
        place_id: 456,
        display_name: "New York",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => customResponse,
      });

      const result = await geocodeReverse(
        { latitude: "40.7128", longitude: "-74.0060" },
        { format: "json" },
      );

      expect(result).toEqual(customResponse);
    });
  });

  describe("API options", () => {
    it("should handle API parameters correctly", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await geocodeReverse(
        { latitude: "51.5074", longitude: "-0.1278" },
        {
          format: "json",
          addressdetails: 1,
          zoom: 18,
          "accept-language": "en",
        },
      );

      let callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      let url = callArgs![0] as string;
      expect(url).toContain("format=json");
      expect(url).toContain("addressdetails=1");
      expect(url).toContain("zoom=18");
      expect(url).toContain("accept-language=en");

      vi.clearAllMocks();
      await geocodeReverse(
        { latitude: "51.5074", longitude: "-0.1278" },
        { format: "json", zoom: undefined },
      );

      callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      url = callArgs![0] as string;
      expect(url).toContain("format=json");
      expect(url).not.toContain("zoom=");
    });
  });

  describe("cache options", () => {
    it("should work with cache configuration", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await geocodeReverse(
        { latitude: "51.5074", longitude: "-0.1278" },
        { format: "json", cache: { enabled: false, maxSize: 100, ttl: 5000 } },
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

      await geocodeReverse(
        { latitude: "51.5074", longitude: "-0.1278" },
        {
          format: "json",
          rateLimit: { enabled: false, limit: 2, interval: 500 },
        },
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

      const result = await geocodeReverse(
        { latitude: "51.5074", longitude: "-0.1278" },
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

      expect(result).toEqual(mockResponse);
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
        geocodeReverse(
          { latitude: "invalid", longitude: "invalid" },
          { format: "json", retry: { enabled: false } },
        ),
      ).rejects.toThrow("HTTP error");
    });

    it("should throw on network error", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network failure"));

      await expect(
        geocodeReverse(
          { latitude: "51.5074", longitude: "-0.1278" },
          { format: "json", retry: { enabled: false } },
        ),
      ).rejects.toThrow("Network failure");
    });
  });

  describe("coordinate variations", () => {
    it("should handle various coordinate formats", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await geocodeReverse(
        { latitude: "35.6762", longitude: "139.6503" },
        { format: "json" },
      );

      let callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      let url = callArgs![0] as string;
      expect(url).toContain("lat=35.6762");
      expect(url).toContain("lon=139.6503");

      vi.clearAllMocks();
      await geocodeReverse(
        { latitude: "-33.8688", longitude: "151.2093" },
        { format: "json" },
      );

      callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs).toBeDefined();
      url = callArgs![0] as string;
      expect(url).toContain("lat=-33.8688");
      expect(url).toContain("lon=151.2093");
    });
  });

  describe("integration", () => {
    it("should work with all options combined", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await geocodeReverse(
        { latitude: "51.5074", longitude: "-0.1278" },
        {
          format: "json",
          addressdetails: 1,
          zoom: 18,
          cache: { enabled: true },
          rateLimit: { enabled: true },
          retry: { enabled: true },
        },
      );

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
