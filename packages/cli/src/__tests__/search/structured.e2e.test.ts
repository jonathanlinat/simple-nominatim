// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { parseJsonOutput, runCli } from "../helpers.e2e.test";

describe("search:structured", () => {
  it("returns JSON data for a structured query", async () => {
    const result = await runCli([
      "search:structured",
      "--city",
      "Paris",
      "--country",
      "France",
      "--format",
      "json",
    ]);

    expect(result.exitCode).toBe(0);

    const data = parseJsonOutput<Array<Record<string, unknown>>>(result.stdout);

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});
