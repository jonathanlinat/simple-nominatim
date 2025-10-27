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

import { geocodeReverse } from "../../reverse/geocode";

describe("geocodeReverse", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("extreme input handling", () => {
    beforeEach(() => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);
    });

    const coordinateScenarios = [
      {
        name: "boundary values",
        coordinates: [
          { lat: "90", lon: "180" },
          { lat: "-90", lon: "-180" },
          { lat: "0", lon: "0" },
          { lat: "90.000000", lon: "180.000000" },
        ],
      },
      {
        name: "malformed values",
        coordinates: [
          { lat: "NaN", lon: "0" },
          { lat: "Infinity", lon: "0" },
          { lat: "undefined", lon: "0" },
          { lat: "null", lon: "0" },
        ],
      },
    ];

    for (const { name, coordinates } of coordinateScenarios) {
      it(`should handle ${name} in coordinates`, async () => {
        for (const { lat, lon } of coordinates) {
          await expect(
            geocodeReverse(
              { latitude: lat, longitude: lon },
              { format: "json" },
            ),
          ).resolves.toBeDefined();
        }
      });
    }
  });
});
