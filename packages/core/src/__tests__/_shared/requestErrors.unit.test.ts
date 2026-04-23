// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import {
  HttpRequestError,
  NetworkRequestError,
  RequestError,
  isRequestError,
} from "../../_shared/requestErrors";

describe("_shared/requestErrors", () => {
  it("HttpRequestError maps 404 to HTTP_ERROR and 429 to HTTP_RATE_LIMIT", () => {
    expect(new HttpRequestError(404, "Not Found").code).toBe("HTTP_ERROR");
    expect(new HttpRequestError(429, "Too Many").code).toBe("HTTP_RATE_LIMIT");
    expect(new HttpRequestError(500, "x").statusCode).toBe(500);
  });

  it("NetworkRequestError carries NETWORK_ERROR and preserves cause", () => {
    const cause = new Error("original");
    const error = new NetworkRequestError("fail", cause);

    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.cause).toBe(cause);
  });

  it("isRequestError narrows RequestError subclasses only", () => {
    expect(isRequestError(new HttpRequestError(500, "x"))).toBe(true);
    expect(isRequestError(new NetworkRequestError("x"))).toBe(true);
    expect(
      isRequestError(
        new RequestError("raw", { code: "HTTP_ERROR", statusCode: 418 }),
      ),
    ).toBe(true);

    expect(isRequestError(new Error("plain"))).toBe(false);
    expect(isRequestError("string")).toBe(false);
    expect(isRequestError(undefined)).toBe(false);
  });
});
