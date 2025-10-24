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

import { beforeEach, describe, expect, it, vi } from "vitest";

import { serviceStatus } from "@simple-nominatim/core";

import { serviceStatusWrapper } from "../../status/service";

import type { ServiceStatusArgv } from "../../status/status.types";

vi.mock("@simple-nominatim/core", () => ({
  serviceStatus: vi.fn(),
}));

describe("serviceStatusWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(serviceStatus).mockResolvedValue({
      status: 0,
      message: "OK",
      data_updated: "2024-01-01T00:00:00Z",
    });
  });

  describe("basic functionality", () => {
    it("should call serviceStatus with correct format", async () => {
      const argv: ServiceStatusArgv = {
        format: "json",
      };

      await serviceStatusWrapper(argv);

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({ format: "json" }),
      );
    });

    it("should handle successful response", async () => {
      const argv: ServiceStatusArgv = {
        format: "json",
      };

      await serviceStatusWrapper(argv);

      expect(console.log).toHaveBeenCalled();
    });

    it("should support text format", async () => {
      const argv: ServiceStatusArgv = {
        format: "text",
      };

      await serviceStatusWrapper(argv);

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({ format: "text" }),
      );
    });
  });

  describe("cache options", () => {
    it("should pass cache configuration", async () => {
      const argv: ServiceStatusArgv = {
        format: "json",
        noCache: true,
        cacheTtl: 8000,
        cacheMaxSize: 100,
      };

      await serviceStatusWrapper(argv);

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          cache: expect.objectContaining({
            enabled: false,
            ttl: 8000,
            maxSize: 100,
          }),
        }),
      );
    });
  });

  describe("rate limit options", () => {
    it("should pass rate limit configuration", async () => {
      const argv: ServiceStatusArgv = {
        format: "json",
        noRateLimit: true,
        rateLimit: 5,
        rateLimitInterval: 3000,
      };

      await serviceStatusWrapper(argv);

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          rateLimit: expect.objectContaining({
            enabled: false,
            limit: 5,
            interval: 3000,
          }),
        }),
      );
    });
  });

  describe("retry options", () => {
    it("should pass retry configuration", async () => {
      const argv: ServiceStatusArgv = {
        format: "json",
        noRetry: true,
        retryMaxAttempts: 4,
        retryInitialDelay: 2000,
      };

      await serviceStatusWrapper(argv);

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          retry: expect.objectContaining({
            enabled: false,
            maxAttempts: 4,
            initialDelay: 2000,
          }),
        }),
      );
    });
  });

  describe("error handling", () => {
    it("should handle API errors", async () => {
      const processExitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      vi.mocked(serviceStatus).mockRejectedValue(
        new Error("Service unavailable"),
      );

      const argv: ServiceStatusArgv = {
        format: "json",
      };

      await serviceStatusWrapper(argv);

      expect(console.error).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(1);

      processExitSpy.mockRestore();
    });

    it("should handle network errors", async () => {
      const processExitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      vi.mocked(serviceStatus).mockRejectedValue(new Error("Network error"));

      const argv: ServiceStatusArgv = {
        format: "text",
      };

      await serviceStatusWrapper(argv);

      expect(console.error).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(1);

      processExitSpy.mockRestore();
    });
  });

  describe("integration", () => {
    it("should handle all options combined", async () => {
      const argv: ServiceStatusArgv = {
        format: "json",
        cacheTtl: 10000,
        cacheMaxSize: 150,
        rateLimit: 8,
        rateLimitInterval: 4000,
        retryMaxAttempts: 5,
        retryInitialDelay: 1500,
      };

      await serviceStatusWrapper(argv);

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          format: "json",
          cache: expect.objectContaining({
            ttl: 10000,
            maxSize: 150,
          }),
          rateLimit: expect.objectContaining({
            limit: 8,
            interval: 4000,
          }),
          retry: expect.objectContaining({
            maxAttempts: 5,
            initialDelay: 1500,
          }),
        }),
      );
    });

    it("should handle disabled features", async () => {
      const argv: ServiceStatusArgv = {
        format: "text",
        noCache: true,
        noRateLimit: true,
        noRetry: true,
      };

      await serviceStatusWrapper(argv);

      expect(vi.mocked(serviceStatus)).toHaveBeenCalledWith(
        expect.objectContaining({
          cache: expect.objectContaining({ enabled: false }),
          rateLimit: expect.objectContaining({ enabled: false }),
          retry: expect.objectContaining({ enabled: false }),
        }),
      );
    });
  });

  describe("error handling", () => {
    it("should handle validation errors", async () => {
      const processExitSpy = vi
        .spyOn(process, "exit")
        .mockImplementation((() => {
          throw new Error("process.exit");
        }) as unknown as typeof process.exit);

      const argv = {
        format: "invalid",
      } as unknown as ServiceStatusArgv;

      try {
        await serviceStatusWrapper(argv);
      } catch (error) {
        expect((error as Error).message).toBe("process.exit");
      }

      expect(processExitSpy).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();

      processExitSpy.mockRestore();
    });
  });
});
