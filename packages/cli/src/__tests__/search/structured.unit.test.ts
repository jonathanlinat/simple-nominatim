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

import { structuredSearch } from "@simple-nominatim/core";

import { structuredSearchWrapper } from "../../search/structured";

import type { StructuredArgv } from "../../search/search.types";

vi.mock("@simple-nominatim/core", () => ({
  structuredSearch: vi.fn(),
}));

describe("structuredSearchWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(structuredSearch).mockResolvedValue([
      {
        place_id: "12345",
        lat: "51.5074",
        lon: "-0.1278",
        display_name: "London, UK",
      },
    ]);
  });

  describe("basic functionality", () => {
    it("should call structuredSearch with correct parameters", async () => {
      const argv: StructuredArgv = {
        country: "United Kingdom",
        format: "json",
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.objectContaining({ country: "United Kingdom" }),
        expect.objectContaining({ format: "json" }),
      );
    });

    it("should handle successful response", async () => {
      const argv: StructuredArgv = {
        country: "France",
        city: "Paris",
        format: "json",
      };

      await structuredSearchWrapper(argv);

      expect(console.log).toHaveBeenCalled();
    });

    it("should pass all address components", async () => {
      const argv: StructuredArgv = {
        country: "UK",
        city: "London",
        street: "10 Downing Street",
        postalcode: "SW1A 2AA",
        county: "Greater London",
        state: "England",
        amenity: "government building",
        format: "json",
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.objectContaining({
          country: "UK",
          city: "London",
          street: "10 Downing Street",
          postalcode: "SW1A 2AA",
          county: "Greater London",
          state: "England",
          amenity: "government building",
        }),
        expect.any(Object),
      );
    });

    it("should pass email parameter when provided", async () => {
      const argv: StructuredArgv = {
        country: "Germany",
        city: "Berlin",
        format: "json",
        email: "user@example.com",
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ email: "user@example.com" }),
      );
    });

    it("should pass limit parameter when provided", async () => {
      const argv: StructuredArgv = {
        country: "Spain",
        city: "Madrid",
        format: "json",
        limit: 5,
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ limit: 5 }),
      );
    });
  });

  describe("cache options", () => {
    it("should pass cache configuration", async () => {
      const argv: StructuredArgv = {
        country: "UK",
        city: "London",
        format: "json",
        noCache: true,
        cacheTtl: 6000,
        cacheMaxSize: 120,
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          cache: expect.objectContaining({
            enabled: false,
            ttl: 6000,
            maxSize: 120,
          }),
        }),
      );
    });
  });

  describe("rate limit options", () => {
    it("should pass rate limit configuration", async () => {
      const argv: StructuredArgv = {
        country: "Austria",
        city: "Vienna",
        format: "json",
        noRateLimit: true,
        rateLimit: 2,
        rateLimitInterval: 2500,
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            enabled: false,
            limit: 2,
            interval: 2500,
          }),
        }),
      );
    });
  });

  describe("retry options", () => {
    it("should pass retry configuration", async () => {
      const argv: StructuredArgv = {
        country: "Sweden",
        city: "Stockholm",
        format: "json",
        noRetry: true,
        retryMaxAttempts: 6,
        retryInitialDelay: 1800,
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          retry: expect.objectContaining({
            enabled: false,
            maxAttempts: 6,
            initialDelay: 1800,
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

      vi.mocked(structuredSearch).mockRejectedValue(new Error("Search failed"));

      const argv: StructuredArgv = {
        country: "Ireland",
        city: "Dublin",
        format: "json",
      };

      await structuredSearchWrapper(argv);

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

      const argv = {
        country: "Ireland",
        city: "Dublin",
        format: "invalid",
      } as unknown as StructuredArgv;

      try {
        await structuredSearchWrapper(argv);
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
      const argv: StructuredArgv = {
        country: "Portugal",
        city: "Lisbon",
        format: "xml",
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ format: "xml" }),
      );
    });

    it("should support geocodejson format", async () => {
      const argv: StructuredArgv = {
        country: "Switzerland",
        city: "Zurich",
        format: "geocodejson",
      };

      await structuredSearchWrapper(argv);

      expect(vi.mocked(structuredSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ format: "geocodejson" }),
      );
    });
  });
});
