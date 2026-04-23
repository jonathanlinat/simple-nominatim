// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { parseJsonOutput, runCli } from "../helpers.e2e.test";

describe("search:free-form", () => {
  it("returns JSON data for a valid free-form query", async () => {
    const result = await runCli([
      "search:free-form",
      "--query",
      "Eiffel Tower, Paris",
      "--format",
      "json",
    ]);

    expect(result.exitCode).toBe(0);

    const data = parseJsonOutput<Array<Record<string, unknown>>>(result.stdout);

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("display_name");
  });

  it("fails fast when query is empty", async () => {
    const result = await runCli([
      "search:free-form",
      "--query",
      "",
      "--format",
      "json",
    ]);

    expect(result.exitCode).toBe(2);
  });
});
