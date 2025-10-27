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

import {
  emailSchema,
  freeFormSearchSchema,
  latitudeSchema,
  limitSchema,
  longitudeSchema,
  structuredSearchSchema,
} from "../../_shared/validation";

describe("validation", () => {
  describe("Coordinate Validation", () => {
    it("should reject out-of-range latitude values", () => {
      expect(() => latitudeSchema.parse("91")).toThrow();
      expect(() => latitudeSchema.parse("-91")).toThrow();
      expect(() => latitudeSchema.parse("999")).toThrow();
    });

    it("should reject out-of-range longitude values", () => {
      expect(() => longitudeSchema.parse("181")).toThrow();
      expect(() => longitudeSchema.parse("-181")).toThrow();
      expect(() => longitudeSchema.parse("999")).toThrow();
    });

    it("should reject malformed coordinate strings", () => {
      expect(() => latitudeSchema.parse("abc")).toThrow();
      expect(() => latitudeSchema.parse("51.5N")).toThrow();
      expect(() => latitudeSchema.parse("NaN")).toThrow();
      expect(() => latitudeSchema.parse("Infinity")).toThrow();
    });

    it("should handle injection attempts in coordinates", () => {
      expect(() => latitudeSchema.parse("'; DROP TABLE--")).toThrow();
      expect(() => latitudeSchema.parse("<script>alert(1)</script>")).toThrow();
      expect(() => longitudeSchema.parse("$(whoami)")).toThrow();
    });
  });

  describe("Email Validation", () => {
    it("should reject invalid email formats", () => {
      expect(() => emailSchema.parse("invalid")).toThrow();
      expect(() => emailSchema.parse("user@")).toThrow();
      expect(() => emailSchema.parse("@domain.com")).toThrow();
    });

    it("should handle injection attempts in email", () => {
      const result = emailSchema.safeParse(
        "test'; DROP TABLE users--@example.com",
      );
      expect(result.success).toBe(false);
    });
  });

  describe("Limit Validation", () => {
    it("should reject limits outside allowed range", () => {
      expect(() => limitSchema.parse(0)).toThrow();
      expect(() => limitSchema.parse(41)).toThrow();
      expect(() => limitSchema.parse(-1)).toThrow();
      expect(() => limitSchema.parse(1000)).toThrow();
    });

    it("should reject non-integer limits", () => {
      expect(() => limitSchema.parse(5.5)).toThrow();
      expect(() => limitSchema.parse(10.1)).toThrow();
    });
  });

  describe("Query Validation", () => {
    it("should reject empty queries", () => {
      const result1 = freeFormSearchSchema.safeParse({
        query: "",
        outputFormat: "json",
      });
      expect(result1.success).toBe(false);
    });

    it("should accept queries with special characters", () => {
      expect(() =>
        freeFormSearchSchema.parse({
          query: "Oslo, Norway",
          outputFormat: "json",
        }),
      ).not.toThrow();

      expect(() =>
        freeFormSearchSchema.parse({
          query: "123 Main St.",
          outputFormat: "json",
        }),
      ).not.toThrow();
    });
  });

  describe("Structured Search Validation", () => {
    it("should accept queries without country parameter", () => {
      const result = structuredSearchSchema.safeParse({
        city: "London",
        outputFormat: "json",
      });
      expect(result.success).toBe(true);
    });

    it("should accept optional country", () => {
      const resultWithCountry = structuredSearchSchema.safeParse({
        country: "UK",
        outputFormat: "json",
      });
      expect(resultWithCountry.success).toBe(true);

      const resultWithoutCountry = structuredSearchSchema.safeParse({
        outputFormat: "json",
      });
      expect(resultWithoutCountry.success).toBe(true);
    });

    it("should handle injection attempts in address fields", () => {
      const maliciousData = {
        country: "'; DROP TABLE--",
        city: "<script>alert(1)</script>",
        street: "$(whoami)",
        outputFormat: "json" as const,
      };

      const result = structuredSearchSchema.safeParse(maliciousData);
      expect(result.success).toBe(true);
    });
  });

  describe("Format Validation", () => {
    it("should only accept valid output formats", () => {
      expect(() =>
        freeFormSearchSchema.parse({
          query: "test",
          outputFormat: "invalid",
        }),
      ).toThrow();

      expect(() =>
        freeFormSearchSchema.parse({
          query: "test",
          outputFormat: "text",
        }),
      ).toThrow();
    });

    it("should accept all valid formats", () => {
      const validFormats = ["xml", "json", "jsonv2", "geojson", "geocodejson"];

      for (const format of validFormats) {
        expect(() =>
          freeFormSearchSchema.parse({
            query: "test",
            outputFormat: format,
          }),
        ).not.toThrow();
      }
    });
  });

  describe("Denial of Service Prevention", () => {
    it("should limit maximum results", () => {
      expect(() =>
        freeFormSearchSchema.parse({
          query: "test",
          outputFormat: "json",
          limit: 1000,
        }),
      ).toThrow("cannot exceed 40");
    });

    it("should handle extremely long input strings", () => {
      const longQuery = "A".repeat(10000);

      const result = freeFormSearchSchema.safeParse({
        query: longQuery,
        outputFormat: "json",
      });

      expect(result.success).toBe(true);
    });
  });
});
