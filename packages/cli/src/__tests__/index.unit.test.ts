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

import { describe, expect, it } from "vitest";

import { geocodeReverseWrapper } from "../reverse/geocode";
import { freeFormSearchWrapper } from "../search/free-form";
import { structuredSearchWrapper } from "../search/structured";
import { serviceStatusWrapper } from "../status/service";

describe("CLI Package", () => {
  describe("command wrappers", () => {
    it("should export geocodeReverseWrapper function", () => {
      expect(geocodeReverseWrapper).toBeDefined();
      expect(typeof geocodeReverseWrapper).toBe("function");
    });

    it("should export freeFormSearchWrapper function", () => {
      expect(freeFormSearchWrapper).toBeDefined();
      expect(typeof freeFormSearchWrapper).toBe("function");
    });

    it("should export structuredSearchWrapper function", () => {
      expect(structuredSearchWrapper).toBeDefined();
      expect(typeof structuredSearchWrapper).toBe("function");
    });

    it("should export serviceStatusWrapper function", () => {
      expect(serviceStatusWrapper).toBeDefined();
      expect(typeof serviceStatusWrapper).toBe("function");
    });
  });

  describe("wrapper function signatures", () => {
    it("should have correct function arity for geocodeReverseWrapper", () => {
      expect(geocodeReverseWrapper.length).toBe(1);
    });

    it("should have correct function arity for freeFormSearchWrapper", () => {
      expect(freeFormSearchWrapper.length).toBe(1);
    });

    it("should have correct function arity for structuredSearchWrapper", () => {
      expect(structuredSearchWrapper.length).toBe(1);
    });

    it("should have correct function arity for serviceStatusWrapper", () => {
      expect(serviceStatusWrapper.length).toBe(1);
    });
  });

  describe("wrapper completeness", () => {
    it("should have all required command wrappers", () => {
      const wrappers = [
        geocodeReverseWrapper,
        freeFormSearchWrapper,
        structuredSearchWrapper,
        serviceStatusWrapper,
      ];

      expect(wrappers).toHaveLength(4);
      wrappers.forEach((wrapper) => {
        expect(wrapper).toBeDefined();
        expect(typeof wrapper).toBe("function");
      });
    });
  });
});
