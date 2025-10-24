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

import { Option } from "commander";
import { describe, expect, it } from "vitest";

import {
  amenityOption,
  cacheMaxSizeOption,
  cacheTtlOption,
  cityOption,
  countryOption,
  countyOption,
  emailOption,
  latitudeOption,
  limitOption,
  longitudeOption,
  noCacheOption,
  noRateLimitOption,
  noRetryOption,
  outputFormatOption,
  postalCodeOption,
  queryOption,
  rateLimitIntervalOption,
  rateLimitOption,
  retryInitialDelayOption,
  retryMaxAttemptsOption,
  stateOption,
  statusFormatOption,
  streetOption,
} from "../../_shared/commanderOptions";

describe("commanderOptions", () => {
  describe("search options", () => {
    it("should define all search options correctly", () => {
      expect(amenityOption).toBeInstanceOf(Option);
      expect(amenityOption.flags).toBe("--amenity <amenity>");
      expect(amenityOption.mandatory).toBe(false);

      expect(cityOption).toBeInstanceOf(Option);
      expect(cityOption.flags).toBe("--city <city>");

      expect(countryOption).toBeInstanceOf(Option);
      expect(countryOption.flags).toBe("--country <country>");
      expect(countryOption.mandatory).toBe(true);

      expect(countyOption.flags).toBe("--county <county>");
      expect(postalCodeOption.flags).toBe("--postal-code <postalCode>");
      expect(queryOption.flags).toBe("-q, --query <query>");
      expect(queryOption.mandatory).toBe(true);
      expect(stateOption.flags).toBe("--state <state>");
      expect(streetOption.flags).toBe("--street <street>");
    });
  });

  describe("coordinate options", () => {
    it("should define latitude and longitude as required options", () => {
      expect(latitudeOption).toBeInstanceOf(Option);
      expect(latitudeOption.flags).toBe("--latitude <latitude>");
      expect(latitudeOption.mandatory).toBe(true);

      expect(longitudeOption).toBeInstanceOf(Option);
      expect(longitudeOption.flags).toBe("--longitude <longitude>");
      expect(longitudeOption.mandatory).toBe(true);
    });
  });

  describe("format options", () => {
    it("should define format options with choices", () => {
      expect(outputFormatOption).toBeInstanceOf(Option);
      expect(outputFormatOption.flags).toBe("-f, --format <format>");
      expect(outputFormatOption.mandatory).toBe(true);
      expect(outputFormatOption.argChoices).toEqual([
        "xml",
        "json",
        "jsonv2",
        "geojson",
        "geocodejson",
      ]);

      expect(statusFormatOption).toBeInstanceOf(Option);
      expect(statusFormatOption.flags).toBe("-f, --format <format>");
      expect(statusFormatOption.mandatory).toBe(true);
      expect(statusFormatOption.argChoices).toEqual(["text", "json"]);
    });
  });

  describe("common options", () => {
    it("should define email and limit options correctly", () => {
      expect(emailOption).toBeInstanceOf(Option);
      expect(emailOption.flags).toBe("-e, --email <email>");

      expect(limitOption).toBeInstanceOf(Option);
      expect(limitOption.flags).toBe("--limit <limit>");
      expect(typeof limitOption.parseArg).toBe("function");
    });
  });

  describe("cache options", () => {
    it("should define all cache options correctly", () => {
      expect(noCacheOption).toBeInstanceOf(Option);
      expect(noCacheOption.flags).toBe("--no-cache");

      expect(cacheTtlOption).toBeInstanceOf(Option);
      expect(cacheTtlOption.flags).toBe("--cache-ttl <cacheTtl>");
      expect(typeof cacheTtlOption.parseArg).toBe("function");

      expect(cacheMaxSizeOption).toBeInstanceOf(Option);
      expect(cacheMaxSizeOption.flags).toBe("--cache-max-size <cacheMaxSize>");
      expect(typeof cacheMaxSizeOption.parseArg).toBe("function");
    });
  });

  describe("rate limiting options", () => {
    it("should define all rate limiting options correctly", () => {
      expect(noRateLimitOption).toBeInstanceOf(Option);
      expect(noRateLimitOption.flags).toBe("--no-rate-limit");

      expect(rateLimitOption).toBeInstanceOf(Option);
      expect(rateLimitOption.flags).toBe("--rate-limit <rateLimit>");
      expect(typeof rateLimitOption.parseArg).toBe("function");

      expect(rateLimitIntervalOption).toBeInstanceOf(Option);
      expect(rateLimitIntervalOption.flags).toBe(
        "--rate-limit-interval <rateLimitInterval>",
      );
      expect(typeof rateLimitIntervalOption.parseArg).toBe("function");
    });
  });

  describe("retry options", () => {
    it("should define all retry options correctly", () => {
      expect(noRetryOption).toBeInstanceOf(Option);
      expect(noRetryOption.flags).toBe("--no-retry");

      expect(retryMaxAttemptsOption).toBeInstanceOf(Option);
      expect(retryMaxAttemptsOption.flags).toBe(
        "--retry-max-attempts <retryMaxAttempts>",
      );
      expect(typeof retryMaxAttemptsOption.parseArg).toBe("function");

      expect(retryInitialDelayOption).toBeInstanceOf(Option);
      expect(retryInitialDelayOption.flags).toBe(
        "--retry-initial-delay <retryInitialDelay>",
      );
      expect(typeof retryInitialDelayOption.parseArg).toBe("function");
    });
  });

  describe("option consistency", () => {
    it("should have all required options marked as mandatory", () => {
      const requiredOptions = [
        countryOption,
        outputFormatOption,
        latitudeOption,
        longitudeOption,
        queryOption,
        statusFormatOption,
      ];

      requiredOptions.forEach((option) => {
        expect(option.mandatory).toBe(true);
      });
    });

    it("should have all boolean flags using --no- prefix", () => {
      expect(noCacheOption.flags).toContain("--no-");
      expect(noRateLimitOption.flags).toContain("--no-");
      expect(noRetryOption.flags).toContain("--no-");
    });

    it("should have all format options with choices array", () => {
      expect(Array.isArray(outputFormatOption.argChoices)).toBe(true);
      expect(outputFormatOption.argChoices?.length).toBeGreaterThan(0);
      expect(Array.isArray(statusFormatOption.argChoices)).toBe(true);
      expect(statusFormatOption.argChoices?.length).toBeGreaterThan(0);
    });

    it("should have parseInt parser for numeric options", () => {
      const numericOptions = [
        limitOption,
        cacheTtlOption,
        cacheMaxSizeOption,
        rateLimitOption,
        rateLimitIntervalOption,
        retryMaxAttemptsOption,
        retryInitialDelayOption,
      ];

      numericOptions.forEach((option) => {
        expect(typeof option.parseArg).toBe("function");

        if (option.parseArg) {
          expect(option.parseArg("42", undefined)).toBe(42);
          expect(option.parseArg("0", undefined)).toBe(0);
          expect(option.parseArg("100", undefined)).toBe(100);
        }
      });
    });

    it("should have short flags for frequently used options", () => {
      expect(emailOption.flags).toMatch(/-e,/);
      expect(outputFormatOption.flags).toMatch(/-f,/);
      expect(queryOption.flags).toMatch(/-q,/);
      expect(statusFormatOption.flags).toMatch(/-f,/);
    });

    it("should use kebab-case for multi-word option names", () => {
      expect(postalCodeOption.flags).toContain("--postal-code");
      expect(cacheTtlOption.flags).toContain("--cache-ttl");
      expect(cacheMaxSizeOption.flags).toContain("--cache-max-size");
      expect(rateLimitOption.flags).toContain("--rate-limit");
      expect(rateLimitIntervalOption.flags).toContain("--rate-limit-interval");
      expect(retryMaxAttemptsOption.flags).toContain("--retry-max-attempts");
      expect(retryInitialDelayOption.flags).toContain("--retry-initial-delay");
    });
  });
});
