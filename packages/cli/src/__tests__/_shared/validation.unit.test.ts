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

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

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

describe("validation", () => {
  describe("outputFormatSchema", () => {
    it("should validate output formats", () => {
      expect(outputFormatSchema.parse("xml")).toBe("xml");
      expect(outputFormatSchema.parse("json")).toBe("json");
      expect(outputFormatSchema.parse("jsonv2")).toBe("jsonv2");
      expect(outputFormatSchema.parse("geojson")).toBe("geojson");
      expect(outputFormatSchema.parse("geocodejson")).toBe("geocodejson");

      expect(() => outputFormatSchema.parse("invalid")).toThrow();
      expect(() => outputFormatSchema.parse("text")).toThrow();
    });
  });

  describe("statusFormatSchema", () => {
    it("should validate status formats", () => {
      expect(statusFormatSchema.parse("text")).toBe("text");
      expect(statusFormatSchema.parse("json")).toBe("json");

      expect(() => statusFormatSchema.parse("xml")).toThrow();
    });
  });

  describe("latitudeSchema", () => {
    it("should validate latitude values", () => {
      expect(latitudeSchema.parse("0")).toBe("0");
      expect(latitudeSchema.parse("51.5074")).toBe("51.5074");
      expect(latitudeSchema.parse("-33.8688")).toBe("-33.8688");
      expect(latitudeSchema.parse("90")).toBe("90");
      expect(latitudeSchema.parse("-90")).toBe("-90");

      expect(() => latitudeSchema.parse("91")).toThrow("between -90 and 90");
      expect(() => latitudeSchema.parse("-91")).toThrow("between -90 and 90");

      expect(() => latitudeSchema.parse("abc")).toThrow("valid number");
      expect(() => latitudeSchema.parse("51.5N")).toThrow("valid number");
    });
  });

  describe("longitudeSchema", () => {
    it("should validate longitude values", () => {
      expect(longitudeSchema.parse("0")).toBe("0");
      expect(longitudeSchema.parse("-0.1278")).toBe("-0.1278");
      expect(longitudeSchema.parse("139.6503")).toBe("139.6503");
      expect(longitudeSchema.parse("180")).toBe("180");
      expect(longitudeSchema.parse("-180")).toBe("-180");

      expect(() => longitudeSchema.parse("181")).toThrow(
        "between -180 and 180",
      );
      expect(() => longitudeSchema.parse("-181")).toThrow(
        "between -180 and 180",
      );

      expect(() => longitudeSchema.parse("xyz")).toThrow("valid number");
    });
  });

  describe("emailSchema", () => {
    it("should validate email addresses", () => {
      expect(emailSchema.parse("user@example.com")).toBe("user@example.com");
      expect(emailSchema.parse("test.user@domain.co.uk")).toBe(
        "test.user@domain.co.uk",
      );
      expect(emailSchema.parse()).toBeUndefined();

      expect(() => emailSchema.parse("invalid")).toThrow("valid email");
      expect(() => emailSchema.parse("user@")).toThrow("valid email");
    });
  });

  describe("limitSchema", () => {
    it("should validate limit values", () => {
      expect(limitSchema.parse(1)).toBe(1);
      expect(limitSchema.parse(10)).toBe(10);
      expect(limitSchema.parse(40)).toBe(40);
      expect(limitSchema.parse()).toBeUndefined();

      expect(() => limitSchema.parse(0)).toThrow("at least 1");
      expect(() => limitSchema.parse(41)).toThrow("cannot exceed 40");

      expect(() => limitSchema.parse(5.5)).toThrow("must be an integer");
    });
  });

  describe("freeFormSearchSchema", () => {
    it("should validate free-form search data", () => {
      const validData = {
        query: "London",
        outputFormat: "json",
        email: "user@example.com",
        limit: 10,
      };

      expect(freeFormSearchSchema.parse(validData)).toStrictEqual(validData);

      const minimalData = { query: "Paris", outputFormat: "json" };
      const result = freeFormSearchSchema.parse(minimalData);

      expect(result.query).toBe("Paris");
      expect(result.outputFormat).toBe("json");

      expect(() =>
        freeFormSearchSchema.parse({ query: "", outputFormat: "json" }),
      ).toThrow("cannot be empty");
      expect(() =>
        freeFormSearchSchema.parse({ outputFormat: "json" }),
      ).toThrow();
    });
  });

  describe("structuredSearchSchema", () => {
    it("should validate structured search data", () => {
      const validData = {
        country: "United Kingdom",
        outputFormat: "json",
        city: "London",
        street: "10 Downing Street",
        postalcode: "SW1A 2AA",
        email: "user@example.com",
        limit: 5,
      };

      expect(structuredSearchSchema.parse(validData)).toStrictEqual(validData);

      const minimalData = { country: "UK", outputFormat: "json" };

      expect(structuredSearchSchema.parse(minimalData).country).toBe("UK");

      const dataWithoutCountry = { outputFormat: "json" };

      expect(structuredSearchSchema.parse(dataWithoutCountry)).toStrictEqual(
        dataWithoutCountry,
      );
    });
  });

  describe("reverseGeocodeSchema", () => {
    it("should validate reverse geocode data", () => {
      const validData = {
        latitude: "51.5074",
        longitude: "-0.1278",
        outputFormat: "json",
        email: "user@example.com",
      };

      expect(reverseGeocodeSchema.parse(validData)).toStrictEqual(validData);

      const minimalData = {
        latitude: "40.7128",
        longitude: "-74.0060",
        outputFormat: "json",
      };
      const result = reverseGeocodeSchema.parse(minimalData);

      expect(result.latitude).toBe("40.7128");
      expect(result.longitude).toBe("-74.0060");

      expect(() =>
        reverseGeocodeSchema.parse({
          latitude: "100",
          longitude: "-0.1278",
          outputFormat: "json",
        }),
      ).toThrow();
    });
  });

  describe("serviceStatusSchema", () => {
    it("should validate service status formats", () => {
      expect(
        serviceStatusSchema.parse({ statusFormat: "json" }).statusFormat,
      ).toBe("json");
      expect(
        serviceStatusSchema.parse({ statusFormat: "text" }).statusFormat,
      ).toBe("text");

      expect(() =>
        serviceStatusSchema.parse({ statusFormat: "xml" }),
      ).toThrow();
    });
  });

  describe("safeValidateArgs", () => {
    it("should return success for valid data", () => {
      const schema = z.object({ name: z.string() });
      const data = { name: "test" };

      const result = safeValidateArgs(schema, data);

      expect(result.success).toBe(true);
      expect(result.success && result.data).toStrictEqual(data);
    });

    it("should return error for invalid data", () => {
      const schema = z.object({ name: z.string() });
      const data = { name: 123 };

      const result = safeValidateArgs(schema, data);

      expect(result.success).toBe(false);
      expect(!result.success && result.error).toBeInstanceOf(z.ZodError);
    });

    it("should work with complex schemas", () => {
      const schema = z.object({
        id: z.number(),
        name: z.string(),
        email: z.email(),
      });
      const validData = {
        id: 1,
        name: "John",
        email: "john@example.com",
      };

      const result = safeValidateArgs(schema, validData);

      expect(result.success).toBe(true);
    });
  });

  describe("handleValidationError", () => {
    let consoleErrorSpy: ReturnType<typeof vi.fn>;
    let processExitSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      processExitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("process.exit called");
      });
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      processExitSpy.mockRestore();
    });

    it("should log validation errors", () => {
      const schema = z.object({ name: z.string() });
      const result = schema.safeParse({ name: 123 });

      expect(result.success).toBe(false);
      expect(() =>
        handleValidationError(
          (result as { success: false; error: z.ZodError }).error,
        ),
      ).toThrow("process.exit called");
      expect(consoleErrorSpy).toHaveBeenCalledWith("Validation error:");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("should exit process with code 1", () => {
      const schema = z.object({ name: z.string() });
      const result = schema.safeParse({ name: 123 });

      expect(result.success).toBe(false);
      expect(() =>
        handleValidationError(
          (result as { success: false; error: z.ZodError }).error,
        ),
      ).toThrow("process.exit called");
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should format multiple errors", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
        email: z.email(),
      });
      const result = schema.safeParse({
        name: 123,
        age: "invalid",
        email: "not-an-email",
      });

      expect(result.success).toBe(false);
      expect(() =>
        handleValidationError(
          (result as { success: false; error: z.ZodError }).error,
        ),
      ).toThrow("process.exit called");
      expect(consoleErrorSpy.mock.calls.length).toBeGreaterThan(1);
    });
  });
});
