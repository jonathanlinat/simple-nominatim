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

import { serviceStatus, type StatusFormat } from "@simple-nominatim/core";
import type { MockInstance } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { serviceStatusWrapper } from "../../status/service";

vi.mock("@simple-nominatim/core", () => ({
  serviceStatus: vi.fn(),
}));

const MOCK_RESPONSE = {
  status: 0,
  message: "OK",
  data_updated: "2024-01-01T00:00:00Z",
  software_version: "4.5.0",
  database_version: "4.5.0",
};

describe("status:service", () => {
  let consoleLogSpy: MockInstance<typeof console.log>;
  let consoleErrorSpy: MockInstance<typeof console.error>;

  beforeEach(() => {
    vi.clearAllMocks();

    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(serviceStatus).mockResolvedValue(MOCK_RESPONSE);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("core functionality", () => {
    it("should call serviceStatus with correct options", async () => {
      await serviceStatusWrapper({
        format: "json",
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
      });
    });

    it("should output JSON response", async () => {
      await serviceStatusWrapper({
        format: "json",
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(MOCK_RESPONSE));
    });
  });

  describe("API parameters", () => {
    it("should pass format parameter", async () => {
      await serviceStatusWrapper({
        format: "text",
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "text",
      });
    });
  });

  describe("cache configuration builder", () => {
    it("should build cache config when cache TTL is provided", async () => {
      await serviceStatusWrapper({
        format: "json",
        cacheTtl: 5000,
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
        cache: {
          ttl: 5000,
        },
      });
    });

    it("should build cache config when cache max size is provided", async () => {
      await serviceStatusWrapper({
        format: "json",
        cacheMaxSize: 200,
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
        cache: {
          maxSize: 200,
        },
      });
    });

    it("should disable cache when noCache is true", async () => {
      await serviceStatusWrapper({
        format: "json",
        noCache: true,
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
        cache: {
          enabled: false,
        },
      });
    });
  });

  describe("rate limit configuration builder", () => {
    it("should build rate limit config when rate limit is provided", async () => {
      await serviceStatusWrapper({
        format: "json",
        rateLimit: 10,
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
        rateLimit: {
          limit: 10,
        },
      });
    });

    it("should build rate limit config when rate limit interval is provided", async () => {
      await serviceStatusWrapper({
        format: "json",
        rateLimitInterval: 2000,
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
        rateLimit: {
          interval: 2000,
        },
      });
    });

    it("should disable rate limit when noRateLimit is true", async () => {
      await serviceStatusWrapper({
        format: "json",
        noRateLimit: true,
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
        rateLimit: {
          enabled: false,
        },
      });
    });
  });

  describe("retry configuration builder", () => {
    it("should build retry config when retry max attempts is provided", async () => {
      await serviceStatusWrapper({
        format: "json",
        retryMaxAttempts: 5,
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
        retry: {
          maxAttempts: 5,
        },
      });
    });

    it("should build retry config when retry initial delay is provided", async () => {
      await serviceStatusWrapper({
        format: "json",
        retryInitialDelay: 2000,
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
        retry: {
          initialDelay: 2000,
        },
      });
    });

    it("should disable retry when noRetry is true", async () => {
      await serviceStatusWrapper({
        format: "json",
        noRetry: true,
      });

      expect(serviceStatus).toHaveBeenCalledWith({
        format: "json",
        retry: {
          enabled: false,
        },
      });
    });
  });

  describe("validation", () => {
    it("should validate output format", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      await serviceStatusWrapper({
        format: "invalid" as StatusFormat,
      });

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalled();

      mockExit.mockRestore();
    });
  });

  describe("error handling", () => {
    it("should handle API errors", async () => {
      const mockExit = vi
        .spyOn(process, "exit")
        .mockImplementation(() => undefined as never);

      vi.mocked(serviceStatus).mockRejectedValueOnce(
        new Error("API request failed"),
      );

      await serviceStatusWrapper({
        format: "json",
      });

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalled();

      mockExit.mockRestore();
    });
  });
});
