// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { runCli } from "../helpers.e2e.test";

describe("status:service", () => {
  it("returns OK text by default", async () => {
    const result = await runCli(["status:service"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("OK");
  });
});
