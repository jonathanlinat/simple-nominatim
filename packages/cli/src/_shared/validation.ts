// SPDX-License-Identifier: MIT

import { z } from "zod";

export const outputFormatSchema = z.enum([
  "xml",
  "json",
  "jsonv2",
  "geojson",
  "geocodejson",
]);

export const statusFormatSchema = z.enum(["text", "json"]);

export const latitudeSchema = z
  .string()
  .regex(/^-?\d+\.?\d*$/, "Latitude must be a valid number")
  .refine(
    (value) => {
      const n = Number.parseFloat(value);
      return n >= -90 && n <= 90;
    },
    { message: "Latitude must be between -90 and 90" },
  );

export const longitudeSchema = z
  .string()
  .regex(/^-?\d+\.?\d*$/, "Longitude must be a valid number")
  .refine(
    (value) => {
      const n = Number.parseFloat(value);
      return n >= -180 && n <= 180;
    },
    { message: "Longitude must be between -180 and 180" },
  );

export const emailSchema = z
  .string()
  .email("Email must be a valid email address")
  .optional();

export const limitSchema = z
  .number()
  .int("Limit must be an integer")
  .min(1, "Limit must be at least 1")
  .max(40, "Limit cannot exceed 40 (Nominatim API limit)")
  .optional();

export const freeFormSearchSchema = z.object({
  query: z.string().min(1, "Query string cannot be empty"),
  outputFormat: outputFormatSchema,
  email: emailSchema,
  limit: limitSchema,
});

export const structuredSearchSchema = z
  .object({
    country: z.string().optional(),
    outputFormat: outputFormatSchema,
    amenity: z.string().optional(),
    city: z.string().optional(),
    county: z.string().optional(),
    email: emailSchema,
    limit: limitSchema,
    postalCode: z.string().optional(),
    state: z.string().optional(),
    street: z.string().optional(),
  })
  .refine(
    (v) =>
      [
        v.amenity,
        v.city,
        v.country,
        v.county,
        v.postalCode,
        v.state,
        v.street,
      ].some((f) => f !== undefined && f !== ""),
    {
      message:
        "At least one of amenity, city, country, county, postalCode, state, or street is required",
      path: ["amenity"],
    },
  );

export const reverseGeocodeSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  outputFormat: outputFormatSchema,
  email: emailSchema,
});

export const serviceStatusSchema = z.object({
  statusFormat: statusFormatSchema,
});

export const formatValidationError = (error: z.ZodError): string[] => [
  "Validation error:",
  ...error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`),
];
