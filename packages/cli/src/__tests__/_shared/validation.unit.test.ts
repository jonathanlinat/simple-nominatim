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

import type { MockInstance } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import {
  emailSchema,
  freeFormSearchSchema,
  handleValidationError,
  latitudeSchema,
  limitSchema,
  longitudeSchema,
  outputFormatSchema,
  reverseGeocodeSchema,
  safeValidateArgs,
  serviceStatusSchema,
  statusFormatSchema,
  structuredSearchSchema,
} from "../../_shared/validation";

describe("shared:validation", () => {
  describe("outputFormatSchema", () => {
    it("should accept valid output formats", () => {
      expect(outputFormatSchema.parse("xml")).toBe("xml");
      expect(outputFormatSchema.parse("json")).toBe("json");
      expect(outputFormatSchema.parse("jsonv2")).toBe("jsonv2");
      expect(outputFormatSchema.parse("geojson")).toBe("geojson");
      expect(outputFormatSchema.parse("geocodejson")).toBe("geocodejson");
    });

    it("should reject invalid output formats", () => {
      expect(() => outputFormatSchema.parse("invalid")).toThrow();
      expect(() => outputFormatSchema.parse("yaml")).toThrow();
      expect(() => outputFormatSchema.parse("")).toThrow();
    });
  });

  describe("statusFormatSchema", () => {
    it("should accept valid status formats", () => {
      expect(statusFormatSchema.parse("text")).toBe("text");
      expect(statusFormatSchema.parse("json")).toBe("json");
    });

    it("should reject invalid status formats", () => {
      expect(() => statusFormatSchema.parse("xml")).toThrow();
      expect(() => statusFormatSchema.parse("invalid")).toThrow();
      expect(() => statusFormatSchema.parse("")).toThrow();
    });
  });

  describe("latitudeSchema", () => {
    it("should accept valid latitude values", () => {
      expect(latitudeSchema.parse("0")).toBe("0");
      expect(latitudeSchema.parse("48.8566")).toBe("48.8566");
      expect(latitudeSchema.parse("-48.8566")).toBe("-48.8566");
      expect(latitudeSchema.parse("90")).toBe("90");
      expect(latitudeSchema.parse("-90")).toBe("-90");
      expect(latitudeSchema.parse("45")).toBe("45");
    });

    it("should reject latitude values out of range", () => {
      expect(() => latitudeSchema.parse("91")).toThrow();
      expect(() => latitudeSchema.parse("-91")).toThrow();
      expect(() => latitudeSchema.parse("100")).toThrow();
      expect(() => latitudeSchema.parse("-100")).toThrow();
    });

    it("should reject invalid latitude formats", () => {
      expect(() => latitudeSchema.parse("abc")).toThrow();
      expect(() => latitudeSchema.parse("45.67.89")).toThrow();
      expect(() => latitudeSchema.parse("")).toThrow();
    });
  });

  describe("longitudeSchema", () => {
    it("should accept valid longitude values", () => {
      expect(longitudeSchema.parse("0")).toBe("0");
      expect(longitudeSchema.parse("2.3522")).toBe("2.3522");
      expect(longitudeSchema.parse("-2.3522")).toBe("-2.3522");
      expect(longitudeSchema.parse("180")).toBe("180");
      expect(longitudeSchema.parse("-180")).toBe("-180");
      expect(longitudeSchema.parse("90")).toBe("90");
    });

    it("should reject longitude values out of range", () => {
      expect(() => longitudeSchema.parse("181")).toThrow();
      expect(() => longitudeSchema.parse("-181")).toThrow();
      expect(() => longitudeSchema.parse("200")).toThrow();
      expect(() => longitudeSchema.parse("-200")).toThrow();
    });

    it("should reject invalid longitude formats", () => {
      expect(() => longitudeSchema.parse("abc")).toThrow();
      expect(() => longitudeSchema.parse("90.12.34")).toThrow();
      expect(() => longitudeSchema.parse("")).toThrow();
    });
  });

  describe("emailSchema", () => {
    it("should accept valid email addresses", () => {
      expect(emailSchema.parse("test@example.com")).toBe("test@example.com");
      expect(emailSchema.parse("user.name@domain.co.uk")).toBe(
        "user.name@domain.co.uk",
      );
      expect(emailSchema.parse("admin@test-domain.com")).toBe(
        "admin@test-domain.com",
      );
    });

    it("should accept undefined for optional email", () => {
      expect(emailSchema.parse(undefined)).toBeUndefined();
    });

    it("should reject invalid email addresses", () => {
      expect(() => emailSchema.parse("invalid")).toThrow();
      expect(() => emailSchema.parse("@example.com")).toThrow();
      expect(() => emailSchema.parse("test@")).toThrow();
      expect(() => emailSchema.parse("test@.com")).toThrow();
      expect(() => emailSchema.parse("")).toThrow();
    });
  });

  describe("limitSchema", () => {
    it("should accept valid limit values", () => {
      expect(limitSchema.parse(1)).toBe(1);
      expect(limitSchema.parse(10)).toBe(10);
      expect(limitSchema.parse(40)).toBe(40);
      expect(limitSchema.parse(25)).toBe(25);
    });

    it("should accept undefined for optional limit", () => {
      expect(limitSchema.parse(undefined)).toBeUndefined();
    });

    it("should reject limit values out of range", () => {
      expect(() => limitSchema.parse(0)).toThrow();
      expect(() => limitSchema.parse(-1)).toThrow();
      expect(() => limitSchema.parse(41)).toThrow();
      expect(() => limitSchema.parse(100)).toThrow();
    });

    it("should reject non-integer limit values", () => {
      expect(() => limitSchema.parse(10.5)).toThrow();
      expect(() => limitSchema.parse(25.7)).toThrow();
    });
  });

  describe("freeFormSearchSchema", () => {
    it("should accept valid free-form search data", () => {
      const validData = {
        query: "Paris, France",
        outputFormat: "json",
        email: "test@example.com",
        limit: 10,
      };

      const result = freeFormSearchSchema.parse(validData);

      expect(result).toStrictEqual(validData);
    });

    it("should accept minimal valid data", () => {
      const minimalData = {
        query: "London",
        outputFormat: "xml",
      };

      const result = freeFormSearchSchema.parse(minimalData);

      expect(result.query).toBe("London");
      expect(result.outputFormat).toBe("xml");
    });

    it("should reject empty query string", () => {
      const invalidData = {
        query: "",
        outputFormat: "json",
      };

      expect(() => freeFormSearchSchema.parse(invalidData)).toThrow();
    });

    it("should reject invalid output format", () => {
      const invalidData = {
        query: "Paris",
        outputFormat: "invalid",
      };

      expect(() => freeFormSearchSchema.parse(invalidData)).toThrow();
    });

    it("should reject invalid email", () => {
      const invalidData = {
        query: "Paris",
        outputFormat: "json",
        email: "invalid-email",
      };

      expect(() => freeFormSearchSchema.parse(invalidData)).toThrow();
    });

    it("should reject invalid limit", () => {
      const invalidData = {
        query: "Paris",
        outputFormat: "json",
        limit: 50,
      };

      expect(() => freeFormSearchSchema.parse(invalidData)).toThrow();
    });
  });

  describe("structuredSearchSchema", () => {
    it("should accept valid structured search data", () => {
      const validData = {
        country: "France",
        outputFormat: "json",
        city: "Paris",
        email: "test@example.com",
        limit: 10,
      };

      const result = structuredSearchSchema.parse(validData);

      expect(result).toStrictEqual(validData);
    });

    it("should accept minimal valid data", () => {
      const minimalData = {
        outputFormat: "xml",
      };

      const result = structuredSearchSchema.parse(minimalData);

      expect(result.outputFormat).toBe("xml");
    });

    it("should accept all optional address components", () => {
      const fullData = {
        country: "USA",
        outputFormat: "json",
        amenity: "restaurant",
        city: "New York",
        county: "Manhattan",
        email: "test@example.com",
        limit: 5,
        postalcode: "10001",
        state: "NY",
        street: "5th Avenue",
      };

      const result = structuredSearchSchema.parse(fullData);

      expect(result).toStrictEqual(fullData);
    });

    it("should reject invalid output format", () => {
      const invalidData = {
        outputFormat: "invalid",
        city: "London",
      };

      expect(() => structuredSearchSchema.parse(invalidData)).toThrow();
    });
  });

  describe("reverseGeocodeSchema", () => {
    it("should accept valid reverse geocode data", () => {
      const validData = {
        latitude: "48.8566",
        longitude: "2.3522",
        outputFormat: "json",
        email: "test@example.com",
      };

      const result = reverseGeocodeSchema.parse(validData);

      expect(result).toStrictEqual(validData);
    });

    it("should accept minimal valid data", () => {
      const minimalData = {
        latitude: "51.5074",
        longitude: "-0.1278",
        outputFormat: "xml",
      };

      const result = reverseGeocodeSchema.parse(minimalData);

      expect(result.latitude).toBe("51.5074");
      expect(result.longitude).toBe("-0.1278");
      expect(result.outputFormat).toBe("xml");
    });

    it("should reject invalid latitude", () => {
      const invalidData = {
        latitude: "100",
        longitude: "2.3522",
        outputFormat: "json",
      };

      expect(() => reverseGeocodeSchema.parse(invalidData)).toThrow();
    });

    it("should reject invalid longitude", () => {
      const invalidData = {
        latitude: "48.8566",
        longitude: "200",
        outputFormat: "json",
      };

      expect(() => reverseGeocodeSchema.parse(invalidData)).toThrow();
    });

    it("should reject invalid output format", () => {
      const invalidData = {
        latitude: "48.8566",
        longitude: "2.3522",
        outputFormat: "invalid",
      };

      expect(() => reverseGeocodeSchema.parse(invalidData)).toThrow();
    });
  });

  describe("serviceStatusSchema", () => {
    it("should accept valid status format", () => {
      const validData = {
        statusFormat: "json",
      };

      const result = serviceStatusSchema.parse(validData);

      expect(result).toStrictEqual(validData);
    });

    it("should accept text format", () => {
      const validData = {
        statusFormat: "text",
      };

      const result = serviceStatusSchema.parse(validData);

      expect(result.statusFormat).toBe("text");
    });

    it("should reject invalid status format", () => {
      const invalidData = {
        statusFormat: "xml",
      };

      expect(() => serviceStatusSchema.parse(invalidData)).toThrow();
    });
  });

  describe("safeValidateArgs", () => {
    it("should return success with valid data", () => {
      const data = {
        query: "Paris",
        outputFormat: "json",
      };

      const result = safeValidateArgs(freeFormSearchSchema, data);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toStrictEqual(data);
      }
    });

    it("should return error with invalid data", () => {
      const data = {
        query: "",
        outputFormat: "json",
      };

      const result = safeValidateArgs(freeFormSearchSchema, data);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error).toBeInstanceOf(ZodError);
      }
    });

    it("should handle missing required fields", () => {
      const data = {
        outputFormat: "json",
      };

      const result = safeValidateArgs(freeFormSearchSchema, data);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error).toBeInstanceOf(ZodError);
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("handleValidationError", () => {
    let consoleErrorSpy: MockInstance<typeof console.error>;
    let processExitSpy: MockInstance<typeof process.exit>;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      processExitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should log validation errors and exit process", () => {
      const data = {
        query: "",
        outputFormat: "invalid",
      };
      const result = freeFormSearchSchema.safeParse(data);

      if (!result.success) {
        handleValidationError(result.error);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Validation error:");
        expect(consoleErrorSpy.mock.calls.length).toBeGreaterThan(1);
        expect(processExitSpy).toHaveBeenCalledTimes(1);
        expect(processExitSpy).toHaveBeenCalledWith(1);
      }
    });

    it("should format error messages correctly", () => {
      const data = {
        latitude: "100",
        longitude: "200",
        outputFormat: "json",
      };
      const result = reverseGeocodeSchema.safeParse(data);

      if (!result.success) {
        handleValidationError(result.error);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Validation error:");
        const errorCalls = consoleErrorSpy.mock.calls.slice(1);

        expect(errorCalls.length).toBeGreaterThan(0);

        for (const call of errorCalls) {
          expect(call[0]).toMatch(/^\s+-\s+/);
        }
        expect(processExitSpy).toHaveBeenCalledTimes(1);
        expect(processExitSpy).toHaveBeenCalledWith(1);
      }
    });

    it("should handle multiple validation errors", () => {
      const data = {
        query: "",
        outputFormat: "invalid",
        email: "not-an-email",
        limit: 100,
      };
      const result = freeFormSearchSchema.safeParse(data);

      if (!result.success) {
        handleValidationError(result.error);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Validation error:");
        expect(consoleErrorSpy.mock.calls.length).toBeGreaterThan(1);
        expect(processExitSpy).toHaveBeenCalledTimes(1);
        expect(processExitSpy).toHaveBeenCalledWith(1);
      }
    });
  });
});
