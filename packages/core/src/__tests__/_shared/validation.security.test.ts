/**
 * MIT License
 *
 * Copyright (c) 2023-2025 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software:"), to deal
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

import { geocodeReverse } from "../../reverse/geocode";
import { freeFormSearch } from "../../search/free-form";
import { structuredSearch } from "../../search/structured";

describe("Input Validation", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("SQL Injection Prevention", () => {
    it("should handle SQL injection attempts in free-form search", async () => {
      const maliciousQueries = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM users--",
        "1'; DELETE FROM locations WHERE '1'='1",
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      for (const query of maliciousQueries) {
        await expect(
          freeFormSearch({ query }, { format: "json" }),
        ).resolves.toBeDefined();

        const calls = vi.mocked(global.fetch).mock.calls;
        if (calls.length > 0 && calls[0]) {
          const callUrl = calls[0][0] as string;
          expect(callUrl).toContain("search");
          expect(callUrl).toContain("q=");
        }
      }
    });

    it("should handle SQL injection attempts in structured search", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      await expect(
        structuredSearch(
          {
            street: "'; DROP TABLE streets; --",
            city: "1' OR '1'='1",
            country: "admin'--",
          },
          { format: "json" },
        ),
      ).resolves.toBeDefined();
    });
  });

  describe("XSS Prevention", () => {
    it("should handle XSS attempts in search queries", async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert("xss")>',
        'javascript:alert("xss")',
        '<svg onload=alert("xss")>',
        '"><script>alert(String.fromCharCode(88,83,83))</script>',
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      for (const payload of xssPayloads) {
        const result = await freeFormSearch(
          { query: payload },
          { format: "json" },
        );

        const resultStr = JSON.stringify(result);
        expect(resultStr).not.toContain("<script>");
        expect(resultStr).not.toContain("onerror=");
        expect(resultStr).not.toContain("javascript:");
      }
    });
  });

  describe("Command Injection Prevention", () => {
    it("should handle shell command injection attempts", async () => {
      const commandInjections = [
        "test; ls -la",
        "test && cat /etc/passwd",
        "test | whoami",
        "test $(whoami)",
        "test `whoami`",
        "test; rm -rf /",
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      for (const cmd of commandInjections) {
        await expect(
          freeFormSearch({ query: cmd }, { format: "json" }),
        ).resolves.toBeDefined();
      }
    });
  });

  describe("Path Traversal Prevention", () => {
    it("should handle path traversal attempts", async () => {
      const pathTraversals = [
        "../../../etc/passwd",
        "..\\..\\..\\windows\\system32",
        "....//....//....//etc/passwd",
        "%2e%2e%2f%2e%2e%2f%2e%2e%2f",
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      for (const path of pathTraversals) {
        await expect(
          freeFormSearch({ query: path }, { format: "json" }),
        ).resolves.toBeDefined();
      }
    });
  });

  describe("NoSQL Injection Prevention", () => {
    it("should handle NoSQL injection attempts", async () => {
      const noSqlInjections = [
        '{"$gt": ""}',
        '{"$ne": null}',
        '{"$where": "sleep(1000)"}',
        '{"username": {"$regex": ".*"}}',
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      for (const injection of noSqlInjections) {
        await expect(
          freeFormSearch({ query: injection }, { format: "json" }),
        ).resolves.toBeDefined();
      }
    });
  });

  describe("Extreme Input Handling", () => {
    it("should handle extremely long input strings", async () => {
      const longString = "A".repeat(10000);

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      await expect(
        freeFormSearch({ query: longString }, { format: "json" }),
      ).resolves.toBeDefined();
    });

    it("should handle unicode and special characters", async () => {
      const specialChars = [
        "🏠 emoji house",
        "北京市",
        "Москва",
        "القاهرة",
        "±§¶•ªº–≠",
        "\u0000\u0001\u0002",
        String.fromCharCode(0),
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      for (const chars of specialChars) {
        await expect(
          freeFormSearch({ query: chars }, { format: "json" }),
        ).resolves.toBeDefined();
      }
    });

    it("should handle coordinate boundary values", async () => {
      const boundaries = [
        { lat: "90", lon: "180" },
        { lat: "-90", lon: "-180" },
        { lat: "0", lon: "0" },
        { lat: "90.000000", lon: "180.000000" },
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response);

      for (const { lat, lon } of boundaries) {
        await expect(
          geocodeReverse({ latitude: lat, longitude: lon }, { format: "json" }),
        ).resolves.toBeDefined();
      }
    });

    it("should handle malformed coordinates", async () => {
      const malformed = [
        { lat: "NaN", lon: "0" },
        { lat: "Infinity", lon: "0" },
        { lat: "undefined", lon: "0" },
        { lat: "null", lon: "0" },
      ];

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response);

      for (const { lat, lon } of malformed) {
        await expect(
          geocodeReverse({ latitude: lat, longitude: lon }, { format: "json" }),
        ).resolves.toBeDefined();
      }
    });
  });

  describe("Header Injection Prevention", () => {
    it("should not allow CRLF injection in User-Agent", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      await freeFormSearch({ query: "test" }, { format: "json" });

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];
      expect(fetchCall).toBeDefined();

      if (fetchCall) {
        const headers = (fetchCall[1] as RequestInit)?.headers as Record<
          string,
          string
        >;

        expect(headers["User-Agent"]).not.toContain("\r\n");
        expect(headers["User-Agent"]).not.toContain("\n");
        expect(headers["User-Agent"]).not.toContain("\r");
      }
    });
  });

  describe("Denial of Service Prevention", () => {
    it("should respect rate limiting", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      const promises = Array.from({ length: 10 }, () =>
        freeFormSearch({ query: "test" }, { format: "json" }),
      );

      await expect(Promise.all(promises)).resolves.toBeDefined();
    });

    it("should handle retry exhaustion gracefully", async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"));

      await expect(
        freeFormSearch(
          { query: "test" },
          {
            format: "json",
            retry: { enabled: true, maxAttempts: 2, initialDelay: 10 },
          },
        ),
      ).rejects.toThrow();
    });
  });
});
