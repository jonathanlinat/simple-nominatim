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

import { parseJsonOutput, runCli, sleep } from "../_shared/helpers.e2e.test";

describe("search:structured", () => {
  const testAddress = { city: "Paris", country: "France" };
  const apiDelayMs = 1500;

  describe("output formats", () => {
    it("should output JSON format", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty("place_id");
      expect(data[0]).toHaveProperty("display_name");

      await sleep(apiDelayMs);
    });

    it("should output JSONv2 format", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "jsonv2",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should output GeoJSON format", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "geojson",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("type", "FeatureCollection");
      expect(data).toHaveProperty("features");

      await sleep(apiDelayMs);
    });

    it("should output GeocodeJSON format", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "geocodejson",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("type", "FeatureCollection");
      expect(data).toHaveProperty("geocoding");

      await sleep(apiDelayMs);
    });

    it("should output XML format", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "xml",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("<?xml");

      await sleep(apiDelayMs);
    });
  });

  describe("address components", () => {
    it("should work with street parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--street",
        "10 Downing Street",
        "--city",
        "London",
        "--country",
        "United Kingdom",
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with amenity parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--amenity",
        "restaurant",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with state parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        "Sacramento",
        "--state",
        "California",
        "--country",
        "USA",
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with county parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--county",
        "Essex",
        "--country",
        "United Kingdom",
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with postalcode parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--postal-code",
        "75001",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });
  });

  describe("API parameters", () => {
    it("should work with email parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--email",
        "test@example.com",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with limit parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--limit",
        "5",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeLessThanOrEqual(5);
      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with addressdetails parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--addressdetails",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty("address");

      await sleep(apiDelayMs);
    });

    it("should work with extratags parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--extratags",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with namedetails parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--namedetails",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with accept-language parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--accept-language",
        "en",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with entrances parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--street",
        "10 Downing Street",
        "--city",
        "London",
        "--country",
        "United Kingdom",
        "--format",
        "json",
        "--entrances",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });
  });

  describe("polygon parameters", () => {
    it("should work with polygon-geojson parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--polygon-geojson",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with polygon-kml parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--polygon-kml",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with polygon-svg parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--polygon-svg",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with polygon-text parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--polygon-text",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with polygon-threshold parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--polygon-geojson",
        "1",
        "--polygon-threshold",
        "0.001",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });
  });

  describe("error handling", () => {
    it("should handle missing required address component", async () => {
      const result = await runCli(["search:structured", "--format", "json"]);

      expect(result.exitCode).toBe(1);

      await sleep(apiDelayMs);
    });

    it("should handle invalid format parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "invalid",
      ]);

      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toContain("invalid");
    });

    it("should handle empty address", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        "",
        "--country",
        "",
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(1);

      await sleep(apiDelayMs);
    });
  });

  describe("additional API parameters", () => {
    it("should work with countrycodes parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        "Paris",
        "--country",
        "",
        "--format",
        "json",
        "--countrycodes",
        "fr",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with layer parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--layer",
        "address",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with featuretype parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--featuretype",
        "city",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with viewbox and bounded parameters", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        "Paris",
        "--country",
        "",
        "--format",
        "json",
        "--viewbox",
        "2.2,48.9,2.4,48.8",
        "--bounded",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with dedupe parameter", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--dedupe",
        "0",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });
  });

  describe("cache configuration", () => {
    it("should work with cache disabled", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--no-cache",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with custom cache TTL", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--cache-ttl",
        "120000",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with custom cache max size", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--cache-max-size",
        "200",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });
  });

  describe("rate limit configuration", () => {
    it("should work with rate limit disabled", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--no-rate-limit",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with custom rate limit", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--rate-limit",
        "2",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with custom rate limit interval", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--rate-limit",
        "2",
        "--rate-limit-interval",
        "2000",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });
  });

  describe("retry configuration", () => {
    it("should work with retry disabled", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--no-retry",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with custom retry max attempts", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--retry-max-attempts",
        "5",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should work with custom retry initial delay", async () => {
      const result = await runCli([
        "search:structured",
        "--city",
        testAddress.city,
        "--country",
        testAddress.country,
        "--format",
        "json",
        "--retry-max-attempts",
        "3",
        "--retry-initial-delay",
        "2000",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Array<
        Record<string, unknown>
      >;

      expect(data.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });
  });

  describe("help menu", () => {
    it("should display help information", async () => {
      const result = await runCli(["search:structured", "--help"]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("search:structured");
      expect(result.stdout).toContain("--city");
      expect(result.stdout).toContain("--country");
    });
  });
});
