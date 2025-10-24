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

import { geocodeReverse } from "@simple-nominatim/core";

import { geocodeReverseWrapper } from "../../reverse/geocode";

import type { GeocodeReverseArgv } from "../../reverse/reverse.types";

vi.mock("@simple-nominatim/core", () => ({
  geocodeReverse: vi.fn(),
}));

describe("geocodeReverseWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(geocodeReverse).mockResolvedValue({
      place_id: "12345",
      lat: "51.5074",
      lon: "-0.1278",
      display_name: "London, UK",
    });
  });

  describe("basic functionality", () => {
    it("should call geocodeReverse with correct parameters", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        { latitude: "51.5074", longitude: "-0.1278" },
        expect.objectContaining({ format: "json" }),
      );
    });

    it("should handle successful response", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "40.7128",
        longitude: "-74.0060",
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(console.log).toHaveBeenCalled();
    });

    it("should pass email parameter when provided", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
        email: "user@example.com",
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        { latitude: "51.5074", longitude: "-0.1278" },
        expect.objectContaining({ email: "user@example.com" }),
      );
    });
  });

  describe("cache options", () => {
    it("should pass cache configuration", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
        noCache: true,
        cacheTtl: 10000,
        cacheMaxSize: 200,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          cache: expect.objectContaining({
            enabled: false,
            ttl: 10000,
            maxSize: 200,
          }),
        }),
      );
    });
  });

  describe("rate limit options", () => {
    it("should pass rate limit configuration", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
        noRateLimit: true,
        rateLimit: 5,
        rateLimitInterval: 2000,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            enabled: false,
            limit: 5,
            interval: 2000,
          }),
        }),
      );
    });
  });

  describe("retry options", () => {
    it("should pass retry configuration", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
        noRetry: true,
        retryMaxAttempts: 5,
        retryInitialDelay: 2000,
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          retry: expect.objectContaining({
            enabled: false,
            maxAttempts: 5,
            initialDelay: 2000,
          }),
        }),
      );
    });
  });

  describe("error handling", () => {
    it("should handle API errors", async () => {
      const processExitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      vi.mocked(geocodeReverse).mockRejectedValue(new Error("API Error"));

      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "json",
      };

      await geocodeReverseWrapper(argv);

      expect(console.error).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(1);

      processExitSpy.mockRestore();
    });

    it("should handle validation errors", async () => {
      const processExitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation((() => {
          throw new Error("process.exit");
        }) as unknown as typeof process.exit);

      const argv: GeocodeReverseArgv = {
        latitude: "999",
        longitude: "-0.1278",
        format: "json",
      };

      try {
        await geocodeReverseWrapper(argv);
      } catch (error) {
        expect((error as Error).message).toBe("process.exit");
      }

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();

      processExitSpy.mockRestore();
    });
  });

  describe("output formats", () => {
    it("should support xml format", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "xml",
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ format: "xml" }),
      );
    });

    it("should support jsonv2 format", async () => {
      const argv: GeocodeReverseArgv = {
        latitude: "51.5074",
        longitude: "-0.1278",
        format: "jsonv2",
      };

      await geocodeReverseWrapper(argv);

      expect(vi.mocked(geocodeReverse)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ format: "jsonv2" }),
      );
    });
  });
});
