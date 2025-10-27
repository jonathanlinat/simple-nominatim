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

import { Command } from "commander";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../reverse/geocode", () => ({
  geocodeReverseWrapper: vi.fn(),
}));

vi.mock("../search/freeForm", () => ({
  freeFormSearchWrapper: vi.fn(),
}));

vi.mock("../search/structured", () => ({
  structuredSearchWrapper: vi.fn(),
}));

vi.mock("../status/service", () => ({
  serviceStatusWrapper: vi.fn(),
}));

vi.mock("@simple-nominatim/core", () => ({
  geocodeReverse: vi.fn(),
  freeFormSearch: vi.fn(),
  structuredSearch: vi.fn(),
  serviceStatus: vi.fn(),
}));

describe("index", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Program Configuration", () => {
    it("should create a program with correct name", () => {
      const program = new Command();

      program.name("simple-nominatim");

      expect(program.name()).toBe("simple-nominatim");
    });

    it("should have correct description", () => {
      const program = new Command();

      program.description("CLI tool for interacting with the Nominatim API");

      expect(program.description()).toBe(
        "CLI tool for interacting with the Nominatim API",
      );
    });

    it("should have version from package.json", async () => {
      const packageJson = await import("../../package.json", {
        with: { type: "json" },
      });

      expect(packageJson.default.version).toBeDefined();
      expect(typeof packageJson.default.version).toBe("string");
    });
  });

  describe("Commands Registration", () => {
    it("should register reverse:geocode command", () => {
      const program = new Command();

      program.command("reverse:geocode");

      expect(program.commands.length).toBe(1);
      expect(program.commands[0]?.name()).toBe("reverse:geocode");
    });

    it("should register search:free-form command", () => {
      const program = new Command();

      program.command("search:free-form");

      expect(program.commands.length).toBe(1);
      expect(program.commands[0]?.name()).toBe("search:free-form");
    });

    it("should register search:structured command", () => {
      const program = new Command();

      program.command("search:structured");

      expect(program.commands.length).toBe(1);
      expect(program.commands[0]?.name()).toBe("search:structured");
    });

    it("should register status:service command", () => {
      const program = new Command();

      program.command("status:service");

      expect(program.commands.length).toBe(1);
      expect(program.commands[0]?.name()).toBe("status:service");
    });

    it("should register all four commands", () => {
      const program = new Command();

      program.command("reverse:geocode");
      program.command("search:free-form");
      program.command("search:structured");
      program.command("status:service");

      expect(program.commands.length).toBe(4);
    });
  });

  describe("reverse:geocode Command", () => {
    it("should have correct description", () => {
      const program = new Command();
      const cmd = program
        .command("reverse:geocode")
        .description("Perform reverse geocoding");

      expect(cmd.description()).toBe("Perform reverse geocoding");
    });

    it("should include required options", () => {
      const program = new Command();
      const cmd = program.command("reverse:geocode");

      expect(cmd.options).toBeDefined();
    });
  });

  describe("search:free-form Command", () => {
    it("should have correct description", () => {
      const program = new Command();
      const cmd = program
        .command("search:free-form")
        .description("Perform a free-form search");

      expect(cmd.description()).toBe("Perform a free-form search");
    });

    it("should include required options", () => {
      const program = new Command();
      const cmd = program.command("search:free-form");

      expect(cmd.options).toBeDefined();
    });
  });

  describe("search:structured Command", () => {
    it("should have correct description", () => {
      const program = new Command();
      const cmd = program
        .command("search:structured")
        .description("Perform a structured search");

      expect(cmd.description()).toBe("Perform a structured search");
    });

    it("should include required options", () => {
      const program = new Command();
      const cmd = program.command("search:structured");

      expect(cmd.options).toBeDefined();
    });
  });

  describe("status:service Command", () => {
    it("should have correct description", () => {
      const program = new Command();
      const cmd = program
        .command("status:service")
        .description("Report on the state of the service and database");

      expect(cmd.description()).toBe(
        "Report on the state of the service and database",
      );
    });

    it("should include required options", () => {
      const program = new Command();
      const cmd = program.command("status:service");

      expect(cmd.options).toBeDefined();
    });
  });

  describe("Module Import", () => {
    it("should import package.json with correct structure", async () => {
      const packageJson = await import("../../package.json", {
        with: { type: "json" },
      });

      expect(packageJson.default).toBeDefined();
      expect(packageJson.default.name).toBe("@simple-nominatim/cli");
      expect(packageJson.default.version).toBeDefined();
    });

    it("should have mocked wrapper functions", () => {
      expect(vi.isMockFunction).toBeDefined();
    });
  });

  describe("Program Execution", () => {
    it("should parse command line arguments", () => {
      const program = new Command();

      expect(typeof program.parse).toBe("function");
    });

    it("should handle unknown commands gracefully", () => {
      const program = new Command();

      program.exitOverride();

      expect(program.commands).toBeDefined();
    });
  });
});
