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

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { serviceStatus } from "@simple-nominatim/core";

import { serviceStatusWrapper } from "../../status/service";

import type { ServiceStatusArgv } from "../../status/status.types";

vi.mock("@simple-nominatim/core", () => ({
  serviceStatus: vi.fn(),
}));

describe("serviceStatusWrapper", () => {
  let consoleLogSpy: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(serviceStatus).mockResolvedValue({
      status: 0,
      message: "OK",
      data_updated: "2024-01-01T00:00:00Z",
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("delegation and parameter mapping", () => {
    it("should call serviceStatus with format options", async () => {
      const argv: ServiceStatusArgv = {
        format: "json",
      };

      await serviceStatusWrapper(argv);

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          format: "json",
        }),
      );
    });

    it("should pass config builder results to core function", async () => {
      const argv: ServiceStatusArgv = {
        format: "json",
        noCache: true,
        cacheTtl: 3000,
        noRateLimit: true,
        rateLimit: 5,
        noRetry: true,
        retryMaxAttempts: 2,
      };

      await serviceStatusWrapper(argv);

      const callArgs = vi.mocked(serviceStatus).mock.calls[0]?.[0];

      expect(callArgs).toHaveProperty("cache");
      expect(callArgs).toHaveProperty("rateLimit");
      expect(callArgs).toHaveProperty("retry");
    });

    it.each([
      ["noCache", false, "cache", undefined],
      ["noCache", true, "cache", { enabled: false }],
      ["noRateLimit", false, "rateLimit", undefined],
      ["noRateLimit", true, "rateLimit", { enabled: false }],
      ["noRetry", false, "retry", undefined],
      ["noRetry", true, "retry", { enabled: false }],
    ] as const)(
      "should handle %s flag when set to %s",
      async (flagName, flagValue, configKey, expectedValue) => {
        const argv: ServiceStatusArgv = {
          format: "json",
          [flagName]: flagValue,
        };

        await serviceStatusWrapper(argv);

        const callArgs = vi.mocked(serviceStatus).mock.calls[0]?.[0];

        expect(callArgs?.[configKey]).toStrictEqual(expectedValue);
      },
    );

    it.each([
      ["cacheTtl", 5000, "cache", { ttl: 5000 }],
      ["rateLimit", 5, "rateLimit", { limit: 5 }],
      ["retryMaxAttempts", 5, "retry", { maxAttempts: 5 }],
      ["cacheMaxSize", 200, "cache", { maxSize: 200 }],
      ["rateLimitInterval", 2000, "rateLimit", { interval: 2000 }],
      ["retryInitialDelay", 500, "retry", { initialDelay: 500 }],
    ] as const)(
      "should handle %s parameter",
      async (paramName, paramValue, configKey, expectedConfig) => {
        const argv: ServiceStatusArgv = {
          format: "json",
          [paramName]: paramValue,
        };

        await serviceStatusWrapper(argv);

        const callArgs = vi.mocked(serviceStatus).mock.calls[0]?.[0];

        expect(callArgs?.[configKey]).toStrictEqual(expectedConfig);
      },
    );
  });

  describe("validation", () => {
    it("should validate input and exit on error", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      const argv: ServiceStatusArgv = {
        format: "invalid" as "json",
      };

      await serviceStatusWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();

      mockExit.mockRestore();
    });

    it.each([
      ["noCache", false, "cache", undefined],
      ["noCache", true, "cache", { enabled: false }],
      ["noRateLimit", false, "rateLimit", undefined],
      ["noRateLimit", true, "rateLimit", { enabled: false }],
      ["noRetry", false, "retry", undefined],
      ["noRetry", true, "retry", { enabled: false }],
    ] as const)(
      "should handle %s flag when set to %s",
      async (flagName, flagValue, configKey, expectedValue) => {
        const argv: ServiceStatusArgv = {
          format: "json",
          [flagName]: flagValue,
        };

        await serviceStatusWrapper(argv);

        const callArgs = vi.mocked(serviceStatus).mock.calls[0]?.[0];

        expect(callArgs?.[configKey]).toStrictEqual(expectedValue);
      },
    );

    it.each([
      ["cacheTtl", 5000, "cache", { ttl: 5000 }],
      ["rateLimit", 5, "rateLimit", { limit: 5 }],
      ["retryMaxAttempts", 5, "retry", { maxAttempts: 5 }],
      ["cacheMaxSize", 200, "cache", { maxSize: 200 }],
      ["rateLimitInterval", 2000, "rateLimit", { interval: 2000 }],
      ["retryInitialDelay", 500, "retry", { initialDelay: 500 }],
    ] as const)(
      "should handle %s parameter",
      async (paramName, paramValue, configKey, expectedConfig) => {
        const argv: ServiceStatusArgv = {
          format: "json",
          [paramName]: paramValue,
        };

        await serviceStatusWrapper(argv);

        const callArgs = vi.mocked(serviceStatus).mock.calls[0]?.[0];

        expect(callArgs?.[configKey]).toStrictEqual(expectedConfig);
      },
    );
  });

  describe("response handling", () => {
    it("should output successful response to console", async () => {
      const argv: ServiceStatusArgv = {
        format: "json",
      };

      await serviceStatusWrapper(argv);

      expect(console.log).toHaveBeenCalledWith(expect.any(String));
    });

    it("should handle API errors", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      vi.mocked(serviceStatus).mockRejectedValueOnce(
        new Error("API Error: Server not available"),
      );

      const argv: ServiceStatusArgv = {
        format: "json",
      };

      await serviceStatusWrapper(argv);

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("API Error"),
      );

      mockExit.mockRestore();
    });
  });
});
