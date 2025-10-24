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

import { describe, expect, it } from "vitest";

import * as coreExports from "../index";

describe("Core Package Exports", () => {
  describe("functions", () => {
    it("should export geocodeReverse function", () => {
      expect(coreExports.geocodeReverse).toBeDefined();
      expect(typeof coreExports.geocodeReverse).toBe("function");
    });

    it("should export freeFormSearch function", () => {
      expect(coreExports.freeFormSearch).toBeDefined();
      expect(typeof coreExports.freeFormSearch).toBe("function");
    });

    it("should export structuredSearch function", () => {
      expect(coreExports.structuredSearch).toBeDefined();
      expect(typeof coreExports.structuredSearch).toBe("function");
    });

    it("should export serviceStatus function", () => {
      expect(coreExports.serviceStatus).toBeDefined();
      expect(typeof coreExports.serviceStatus).toBe("function");
    });
  });

  describe("constants", () => {
    it("should export DEFAULT_CACHE_CONFIG", () => {
      expect(coreExports.DEFAULT_CACHE_CONFIG).toBeDefined();
      expect(typeof coreExports.DEFAULT_CACHE_CONFIG).toBe("object");
      expect(coreExports.DEFAULT_CACHE_CONFIG).toHaveProperty("enabled");
      expect(coreExports.DEFAULT_CACHE_CONFIG).toHaveProperty("maxSize");
      expect(coreExports.DEFAULT_CACHE_CONFIG).toHaveProperty("ttl");
    });

    it("should export DEFAULT_RATE_LIMIT_CONFIG", () => {
      expect(coreExports.DEFAULT_RATE_LIMIT_CONFIG).toBeDefined();
      expect(typeof coreExports.DEFAULT_RATE_LIMIT_CONFIG).toBe("object");
      expect(coreExports.DEFAULT_RATE_LIMIT_CONFIG).toHaveProperty("enabled");
      expect(coreExports.DEFAULT_RATE_LIMIT_CONFIG).toHaveProperty("limit");
      expect(coreExports.DEFAULT_RATE_LIMIT_CONFIG).toHaveProperty("interval");
      expect(coreExports.DEFAULT_RATE_LIMIT_CONFIG).toHaveProperty("strict");
    });

    it("should export DEFAULT_RETRY_CONFIG", () => {
      expect(coreExports.DEFAULT_RETRY_CONFIG).toBeDefined();
      expect(typeof coreExports.DEFAULT_RETRY_CONFIG).toBe("object");
      expect(coreExports.DEFAULT_RETRY_CONFIG).toHaveProperty("enabled");
      expect(coreExports.DEFAULT_RETRY_CONFIG).toHaveProperty("maxAttempts");
      expect(coreExports.DEFAULT_RETRY_CONFIG).toHaveProperty("initialDelay");
      expect(coreExports.DEFAULT_RETRY_CONFIG).toHaveProperty("maxDelay");
      expect(coreExports.DEFAULT_RETRY_CONFIG).toHaveProperty(
        "backoffMultiplier",
      );
      expect(coreExports.DEFAULT_RETRY_CONFIG).toHaveProperty("useJitter");
      expect(coreExports.DEFAULT_RETRY_CONFIG).toHaveProperty(
        "retryableStatusCodes",
      );
    });
  });

  describe("API completeness", () => {
    it("should export all required functions", () => {
      const exportedFunctions = Object.keys(coreExports).filter(
        (key) =>
          typeof coreExports[key as keyof typeof coreExports] === "function",
      );

      expect(exportedFunctions).toContain("geocodeReverse");
      expect(exportedFunctions).toContain("freeFormSearch");
      expect(exportedFunctions).toContain("structuredSearch");
      expect(exportedFunctions).toContain("serviceStatus");
    });

    it("should export all required constants", () => {
      const exportedConstants = Object.keys(coreExports).filter(
        (key) =>
          typeof coreExports[key as keyof typeof coreExports] === "object" &&
          key.startsWith("DEFAULT_"),
      );

      expect(exportedConstants).toContain("DEFAULT_CACHE_CONFIG");
      expect(exportedConstants).toContain("DEFAULT_RATE_LIMIT_CONFIG");
      expect(exportedConstants).toContain("DEFAULT_RETRY_CONFIG");
    });
  });

  describe("default configuration values", () => {
    it("should have correct cache defaults", () => {
      expect(coreExports.DEFAULT_CACHE_CONFIG.enabled).toBe(true);
      expect(coreExports.DEFAULT_CACHE_CONFIG.maxSize).toBe(500);
      expect(coreExports.DEFAULT_CACHE_CONFIG.ttl).toBe(300000);
    });

    it("should have correct rate limit defaults", () => {
      expect(coreExports.DEFAULT_RATE_LIMIT_CONFIG.enabled).toBe(true);
      expect(coreExports.DEFAULT_RATE_LIMIT_CONFIG.limit).toBe(1);
      expect(coreExports.DEFAULT_RATE_LIMIT_CONFIG.interval).toBe(1000);
      expect(coreExports.DEFAULT_RATE_LIMIT_CONFIG.strict).toBe(true);
    });

    it("should have correct retry defaults", () => {
      expect(coreExports.DEFAULT_RETRY_CONFIG.enabled).toBe(true);
      expect(coreExports.DEFAULT_RETRY_CONFIG.maxAttempts).toBe(3);
      expect(coreExports.DEFAULT_RETRY_CONFIG.initialDelay).toBe(1000);
      expect(coreExports.DEFAULT_RETRY_CONFIG.maxDelay).toBe(10000);
      expect(coreExports.DEFAULT_RETRY_CONFIG.backoffMultiplier).toBe(2);
      expect(coreExports.DEFAULT_RETRY_CONFIG.useJitter).toBe(true);
      expect(coreExports.DEFAULT_RETRY_CONFIG.retryableStatusCodes).toEqual([
        408, 429, 500, 502, 503, 504,
      ]);
    });
  });
});
