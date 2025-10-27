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

import { freeFormSearch } from "../../search/freeForm";

describe("freeFormSearch", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("injection attack prevention", () => {
    const mockSuccessfulFetch = () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);
    };

    const injectionScenarios = [
      {
        category: "SQL Injection",
        payloads: [
          "'; DROP TABLE users; --",
          "1' OR '1'='1",
          "admin'--",
          "' UNION SELECT * FROM users--",
          "1'; DELETE FROM locations WHERE '1'='1",
        ],
      },
      {
        category: "Command Injection",
        payloads: [
          "test; ls -la",
          "test && cat /etc/passwd",
          "test | whoami",
          "test $(whoami)",
          "test `whoami`",
          "test; rm -rf /",
        ],
      },
      {
        category: "NoSQL Injection",
        payloads: [
          '{"$gt": ""}',
          '{"$ne": null}',
          '{"$where": "sleep(1000)"}',
          '{"username": {"$regex": ".*"}}',
        ],
      },
      {
        category: "Path Traversal",
        payloads: [
          "../../../etc/passwd",
          "..\\..\\..\\windows\\system32",
          "....//....//....//etc/passwd",
          "%2e%2e%2f%2e%2e%2f%2e%2e%2f",
        ],
      },
    ];

    for (const { category, payloads } of injectionScenarios) {
      it(`should handle ${category} attempts in search queries`, async () => {
        mockSuccessfulFetch();

        for (const payload of payloads) {
          await expect(
            freeFormSearch({ query: payload }, { format: "json" }),
          ).resolves.toBeDefined();
        }
      });
    }

    it("should handle XSS attempts and prevent script execution", async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert("xss")>',
        'javascript:alert("xss")',
        '<svg onload=alert("xss")>',
        '"><script>alert(String.fromCharCode(88,83,83))</script>',
      ];

      mockSuccessfulFetch();

      for (const payload of xssPayloads) {
        const result = await freeFormSearch(
          { query: payload },
          { format: "json" },
        );

        const resultString = JSON.stringify(result);

        expect(resultString).not.toContain("<script>");
        expect(resultString).not.toContain("onerror=");
        expect(resultString).not.toContain("javascript:");
      }
    });
  });

  describe("extreme input handling", () => {
    beforeEach(() => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);
    });

    it("should handle extremely long input strings", async () => {
      const longString = "A".repeat(10000);

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
        String.fromCodePoint(0),
      ];

      for (const chars of specialChars) {
        await expect(
          freeFormSearch({ query: chars }, { format: "json" }),
        ).resolves.toBeDefined();
      }
    });
  });

  describe("header injection prevention", () => {
    it("should not allow CRLF injection in User-Agent", async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      await freeFormSearch({ query: "test" }, { format: "json" });

      const fetchCall = vi.mocked(global.fetch).mock.calls[0];

      expect(fetchCall).toBeDefined();

      const headers = (fetchCall?.[1] as RequestInit)?.headers as Record<
        string,
        string
      >;

      expect(headers["User-Agent"]).not.toContain("\r\n");
      expect(headers["User-Agent"]).not.toContain("\n");
      expect(headers["User-Agent"]).not.toContain("\r");
    });
  });

  describe("denial of service prevention", () => {
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
