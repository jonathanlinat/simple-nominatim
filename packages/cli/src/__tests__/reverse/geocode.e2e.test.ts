// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { parseJsonOutput, runCli } from "../helpers.e2e.test";

describe("reverse:geocode", () => {
  it("returns JSON data for valid coordinates", async () => {
    const result = await runCli([
      "reverse:geocode",
      "--latitude",
      "48.8566",
      "--longitude",
      "2.3522",
      "--format",
      "json",
    ]);

    expect(result.exitCode).toBe(0);

    const data = parseJsonOutput<Record<string, unknown>>(result.stdout);

    expect(data).toHaveProperty("display_name");
  });

  it("rejects out-of-range coordinates", async () => {
    const result = await runCli([
      "reverse:geocode",
      "--latitude",
      "999",
      "--longitude",
      "0",
      "--format",
      "json",
    ]);

    expect(result.exitCode).toBe(2);
  });
});
