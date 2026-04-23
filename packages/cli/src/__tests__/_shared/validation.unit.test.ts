// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";
import type { z } from "zod";

import {
  emailSchema,
  formatValidationError,
  freeFormSearchSchema,
  latitudeSchema,
  limitSchema,
  longitudeSchema,
  outputFormatSchema,
  reverseGeocodeSchema,
  serviceStatusSchema,
  structuredSearchSchema,
} from "../../_shared/validation";

describe("_shared/validation", () => {
  it("field schemas accept valid input and reject out-of-bounds input", () => {
    expect(outputFormatSchema.parse("json")).toBe("json");
    expect(() => outputFormatSchema.parse("yaml")).toThrow();

    expect(latitudeSchema.parse("48.8566")).toBe("48.8566");
    expect(() => latitudeSchema.parse("91")).toThrow();

    expect(longitudeSchema.parse("-179.9")).toBe("-179.9");
    expect(() => longitudeSchema.parse("200")).toThrow();

    expect(emailSchema.parse(undefined)).toBeUndefined();
    expect(() => emailSchema.parse("not-an-email")).toThrow();

    expect(limitSchema.parse(10)).toBe(10);
    expect(() => limitSchema.parse(0)).toThrow();
    expect(() => limitSchema.parse(41)).toThrow();
  });

  it("composite schemas reject malformed payloads for every endpoint", () => {
    expect(() =>
      freeFormSearchSchema.parse({ query: "", outputFormat: "json" }),
    ).toThrow();
    expect(() =>
      structuredSearchSchema.parse({ outputFormat: "invalid" }),
    ).toThrow();
    expect(() =>
      reverseGeocodeSchema.parse({
        latitude: "100",
        longitude: "0",
        outputFormat: "json",
      }),
    ).toThrow();
    expect(() => serviceStatusSchema.parse({ statusFormat: "xml" })).toThrow();
  });

  it("formatValidationError emits a header followed by one line per issue", () => {
    const result = freeFormSearchSchema.safeParse({
      query: "",
      outputFormat: "bogus",
    });

    expect(result.success).toBe(false);

    const lines = formatValidationError(
      (result as { success: false; error: z.ZodError }).error,
    );

    expect(lines[0]).toBe("Validation error:");
    expect(lines.length).toBeGreaterThan(1);
  });
});
