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

describe("status:service", () => {
  const apiDelayMs = 1500;

  describe("output formats", () => {
    it("should output JSON format", async () => {
      const result = await runCli(["status:service", "--format", "json"]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();
      expect(typeof data).toBe("object");

      await sleep(apiDelayMs);
    });

    it("should output text format", async () => {
      const result = await runCli(["status:service", "--format", "text"]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("OK");

      await sleep(apiDelayMs);
    });
  });

  describe("error handling", () => {
    it("should handle invalid format", async () => {
      const result = await runCli(["status:service", "--format", "invalid"]);

      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain("invalid");

      await sleep(apiDelayMs);
    });
  });

  describe("cache configuration", () => {
    it("should disable cache", async () => {
      const result = await runCli([
        "status:service",
        "--format",
        "json",
        "--no-cache",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();

      await sleep(apiDelayMs);
    });

    it("should set custom cache TTL", async () => {
      const result = await runCli([
        "status:service",
        "--format",
        "json",
        "--cache-ttl",
        "5000",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();

      await sleep(apiDelayMs);
    });

    it("should set custom cache max size", async () => {
      const result = await runCli([
        "status:service",
        "--format",
        "json",
        "--cache-max-size",
        "200",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();

      await sleep(apiDelayMs);
    });
  });

  describe("rate limit configuration", () => {
    it("should disable rate limit", async () => {
      const result = await runCli([
        "status:service",
        "--format",
        "json",
        "--no-rate-limit",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();

      await sleep(apiDelayMs);
    });

    it("should set custom rate limit", async () => {
      const result = await runCli([
        "status:service",
        "--format",
        "json",
        "--rate-limit",
        "10",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();

      await sleep(apiDelayMs);
    });

    it("should set custom rate limit interval", async () => {
      const result = await runCli([
        "status:service",
        "--format",
        "json",
        "--rate-limit-interval",
        "2000",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();

      await sleep(apiDelayMs);
    });
  });

  describe("retry configuration", () => {
    it("should disable retry", async () => {
      const result = await runCli([
        "status:service",
        "--format",
        "json",
        "--no-retry",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();

      await sleep(apiDelayMs);
    });

    it("should set custom retry max attempts", async () => {
      const result = await runCli([
        "status:service",
        "--format",
        "json",
        "--retry-max-attempts",
        "5",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();

      await sleep(apiDelayMs);
    });

    it("should set custom retry initial delay", async () => {
      const result = await runCli([
        "status:service",
        "--format",
        "json",
        "--retry-initial-delay",
        "2000",
      ]);

      expect(result.exitCode).toBe(0);

      const data = parseJsonOutput(result.stdout);

      expect(data).toBeDefined();

      await sleep(apiDelayMs);
    });
  });

  describe("help menu", () => {
    it("should display help menu", async () => {
      const result = await runCli(["status:service", "--help"]);

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain("status:service");
      expect(result.stdout).toContain("--format");
    });
  });
});
