// SPDX-License-Identifier: MIT

import { HttpRequestError, NetworkRequestError } from "@simple-nominatim/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  CliValidationError,
  getCliErrorMessage,
  getCliExitCode,
  runCommand,
  validateOrThrow,
} from "../../_shared/commandHarness";

describe("_shared/commandHarness", () => {
  it("validateOrThrow passes on valid data and throws CliValidationError on invalid", () => {
    const schema = z.object({ name: z.string().min(1) });

    expect(() => validateOrThrow(schema, { name: "ok" })).not.toThrow();
    expect(() => validateOrThrow(schema, { name: "" })).toThrow(
      CliValidationError,
    );
  });

  describe("exit code contract", () => {
    const cases: [string, unknown, number, string][] = [
      ["CliValidationError", new CliValidationError("bad"), 2, "bad"],
      [
        "429 rate limit",
        new HttpRequestError(429, "Too Many"),
        3,
        "Rate limit",
      ],
      ["5xx unavailable", new HttpRequestError(503, "Gone"), 3, "unavailable"],
      ["4xx generic", new HttpRequestError(400, "Bad"), 3, "Request failed"],
      ["network", new NetworkRequestError("offline"), 4, "Network"],
      ["unknown", new Error("weird"), 1, "Error: weird"],
    ];

    for (const [label, error, exit, messageFragment] of cases) {
      it(`${label} → exit ${exit}`, () => {
        expect(getCliExitCode(error)).toBe(exit);
        expect(getCliErrorMessage(error)).toContain(messageFragment);
      });
    }
  });

  describe("runCommand", () => {
    beforeEach(() => {
      vi.spyOn(console, "log").mockImplementation(() => undefined);
      vi.spyOn(console, "error").mockImplementation(() => undefined);
      vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("prints strings verbatim and JSON-stringifies everything else", async () => {
      await runCommand(async () => "hello");
      await runCommand(async () => ({ a: 1 }));

      expect(console.log).toHaveBeenNthCalledWith(1, "hello");
      expect(console.log).toHaveBeenNthCalledWith(2, '{"a":1}');
    });

    it("routes thrown errors through classify (stderr + exit code)", async () => {
      await runCommand(async () => {
        throw new CliValidationError("nope");
      });

      expect(console.error).toHaveBeenCalledWith("nope");
      expect(process.exit).toHaveBeenCalledWith(2);
    });
  });
});
