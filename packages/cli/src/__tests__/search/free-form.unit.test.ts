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

import { freeFormSearch } from "@simple-nominatim/core";

import { freeFormSearchWrapper } from "../../search/free-form";

import type { FreeFormArgv } from "../../search/search.types";

vi.mock("@simple-nominatim/core", () => ({
  freeFormSearch: vi.fn(),
}));

describe("freeFormSearchWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(freeFormSearch).mockResolvedValue([
      {
        place_id: "12345",
        lat: "51.5074",
        lon: "-0.1278",
        display_name: "London, UK",
      },
    ]);
  });

  describe("basic functionality", () => {
    it("should call freeFormSearch with correct parameters", async () => {
      const argv: FreeFormArgv = {
        query: "London",
        format: "json",
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        { query: "London" },
        expect.objectContaining({ format: "json" }),
      );
    });

    it("should handle successful response", async () => {
      const argv: FreeFormArgv = {
        query: "Paris, France",
        format: "json",
      };

      await freeFormSearchWrapper(argv);

      expect(console.log).toHaveBeenCalled();
    });

    it("should pass email parameter when provided", async () => {
      const argv: FreeFormArgv = {
        query: "New York",
        format: "json",
        email: "user@example.com",
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ email: "user@example.com" }),
      );
    });

    it("should pass limit parameter when provided", async () => {
      const argv: FreeFormArgv = {
        query: "Tokyo",
        format: "json",
        limit: 10,
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ limit: 10 }),
      );
    });
  });

  describe("cache options", () => {
    it("should pass cache configuration", async () => {
      const argv: FreeFormArgv = {
        query: "London",
        format: "json",
        noCache: true,
        cacheTtl: 5000,
        cacheMaxSize: 150,
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          cache: expect.objectContaining({
            enabled: false,
            ttl: 5000,
            maxSize: 150,
          }),
        }),
      );
    });
  });

  describe("rate limit options", () => {
    it("should pass rate limit configuration", async () => {
      const argv: FreeFormArgv = {
        query: "London",
        format: "json",
        noRateLimit: true,
        rateLimit: 3,
        rateLimitInterval: 1500,
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            enabled: false,
            limit: 3,
            interval: 1500,
          }),
        }),
      );
    });
  });

  describe("retry options", () => {
    it("should pass retry configuration", async () => {
      const argv: FreeFormArgv = {
        query: "London",
        format: "json",
        noRetry: true,
        retryMaxAttempts: 4,
        retryInitialDelay: 1500,
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          retry: expect.objectContaining({
            enabled: false,
            maxAttempts: 4,
            initialDelay: 1500,
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

      vi.mocked(freeFormSearch).mockRejectedValue(new Error("Search failed"));

      const argv: FreeFormArgv = {
        query: "Oslo",
        format: "json",
      };

      await freeFormSearchWrapper(argv);

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
        query: "Oslo",
        format: "invalid",
      } as unknown as FreeFormArgv;

      try {
        await freeFormSearchWrapper(argv);
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
      const argv: FreeFormArgv = {
        query: "Helsinki",
        format: "xml",
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ format: "xml" }),
      );
    });

    it("should support geojson format", async () => {
      const argv: FreeFormArgv = {
        query: "Dublin",
        format: "geojson",
      };

      await freeFormSearchWrapper(argv);

      expect(vi.mocked(freeFormSearch)).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ format: "geojson" }),
      );
    });
  });
});
