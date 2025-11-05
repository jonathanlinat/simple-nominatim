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

describe("reverse:geocode", () => {
  const testLocation = { lat: "48.8583736", lon: "2.2922926" };
  const apiDelayMs = 1500;

  describe("output formats", () => {
    it("should output JSON format", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("place_id");
      expect(data).toHaveProperty("display_name");
      expect(String(data.display_name)).toContain("Paris");

      await sleep(apiDelayMs);
    });

    it("should output JSONv2 format", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "jsonv2",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");
      expect(data).toHaveProperty("display_name");

      await sleep(apiDelayMs);
    });

    it("should output GeoJSON format", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "geojson",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("type", "FeatureCollection");
      expect(data).toHaveProperty("features");

      await sleep(apiDelayMs);
    });

    it("should output GeocodeJSON format", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "geocodejson",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("type");
      expect(data).toHaveProperty("geocoding");

      await sleep(apiDelayMs);
    });

    it("should output XML format", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "xml",
      ]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("<?xml");

      await sleep(apiDelayMs);
    });
  });

  describe("API parameters", () => {
    it("should respect addressdetails parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--addressdetails",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("address");
      expect(data.address as Record<string, unknown>).toHaveProperty("city");

      await sleep(apiDelayMs);
    });

    it("should respect extratags parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--extratags",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("extratags");

      await sleep(apiDelayMs);
    });

    it("should respect namedetails parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--namedetails",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("namedetails");

      await sleep(apiDelayMs);
    });

    it("should respect zoom parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--zoom",
        "10",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("display_name");

      await sleep(apiDelayMs);
    });

    it("should respect layer parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--layer",
        "address,poi",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("display_name");

      await sleep(apiDelayMs);
    });

    it("should respect accept-language parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--accept-language",
        "es",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("display_name");

      await sleep(apiDelayMs);
    });
  });

  describe("polygon parameters", () => {
    it("should respect polygon-geojson parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--polygon-geojson",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("geojson");

      await sleep(apiDelayMs);
    });

    it("should respect polygon-kml parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--polygon-kml",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("geokml");

      await sleep(apiDelayMs);
    });

    it("should respect polygon-svg parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--polygon-svg",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("svg");

      await sleep(apiDelayMs);
    });

    it("should respect polygon-text parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--polygon-text",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("geotext");

      await sleep(apiDelayMs);
    });
  });

  describe("error handling", () => {
    it("should fail when latitude is missing", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(1);
    });

    it("should fail when longitude is missing", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(1);
    });

    it("should fail with invalid coordinates", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        "invalid",
        "--longitude",
        "invalid",
        "--format",
        "json",
      ]);

      expect(result.exitCode).toBe(1);
    });
  });

  describe("additional API parameters", () => {
    it("should respect email parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--email",
        "test@example.com",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });

    it("should respect entrances parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--entrances",
        "1",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("display_name");

      await sleep(apiDelayMs);
    });

    it("should respect debug parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        // Debug works with XML format
        "xml",
        "--debug",
        "1",
      ]);

      expect(result.exitCode).toBe(0);
      // Debug parameter adds debug information to the response
      expect(result.stdout).toBeDefined();
      expect(result.stdout!.length).toBeGreaterThan(0);

      await sleep(apiDelayMs);
    });

    it("should respect polygon-threshold parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--polygon-geojson",
        "1",
        "--polygon-threshold",
        "0.001",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout) as Record<string, unknown>;

      expect(data).toHaveProperty("geojson");

      await sleep(apiDelayMs);
    });

    it("should respect json-callback parameter", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        // Use XML with json-callback to avoid parsing issues
        "xml",
        "--json-callback",
        "myCallback",
      ]);

      expect(result.exitCode).toBe(0);
      // json-callback parameter is passed to the API
      expect(result.stdout).toBeDefined();

      await sleep(apiDelayMs);
    });
  });

  describe("cache configuration", () => {
    it("should work with cache disabled", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--no-cache",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });

    it("should work with custom cache TTL", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--cache-ttl",
        "10000",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });

    it("should work with custom cache max size", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--cache-max-size",
        "200",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });
  });

  describe("rate limit configuration", () => {
    it("should work with rate limit disabled", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--no-rate-limit",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });

    it("should work with custom rate limit", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--rate-limit",
        "5",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });

    it("should work with custom rate limit interval", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--rate-limit-interval",
        "2000",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });
  });

  describe("retry configuration", () => {
    it("should work with retry disabled", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--no-retry",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });

    it("should work with custom retry max attempts", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--retry-max-attempts",
        "5",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });

    it("should work with custom retry initial delay", async () => {
      const result = await runCli([
        "reverse:geocode",
        "--latitude",
        testLocation.lat,
        "--longitude",
        testLocation.lon,
        "--format",
        "json",
        "--retry-initial-delay",
        "500",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toHaveProperty("place_id");

      await sleep(apiDelayMs);
    });
  });

  describe("help menu", () => {
    it("should display help information", async () => {
      const result = await runCli(["reverse:geocode", "--help"]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("Usage:");
      expect(result.stdout).toContain("--latitude");
      expect(result.stdout).toContain("--longitude");
      expect(result.stdout).toContain("--format");
    });
  });
});
