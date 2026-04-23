// SPDX-License-Identifier: MIT

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { dataFetcher } from "../../_shared/dataFetcher";
import { NetworkRequestError } from "../../_shared/requestErrors";

const okJson = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

describe("_shared/dataFetcher", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });
  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("builds the request URL from base + endpoint + params and sets User-Agent", async () => {
    fetchSpy.mockResolvedValueOnce(okJson({ ok: true }));

    await dataFetcher(
      "search",
      new URLSearchParams({ q: "paris", format: "json" }),
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];

    expect(url).toBe(
      "https://nominatim.openstreetmap.org/search?q=paris&format=json",
    );

    expect(init.headers).toMatchObject({
      "User-Agent": "@simple-nominatim/core",
    });
  });

  it("honours baseUrl and userAgent overrides (trimming trailing slashes)", async () => {
    fetchSpy.mockResolvedValueOnce(okJson({ ok: true }));

    await dataFetcher("status", new URLSearchParams({ format: "json" }), {
      baseUrl: "https://example.test/",
      userAgent: "custom/1.0",
    });

    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];

    expect(url).toBe("https://example.test/status?format=json");
    expect(init.headers).toMatchObject({ "User-Agent": "custom/1.0" });
  });

  it("returns parsed JSON for non-text formats", async () => {
    fetchSpy.mockResolvedValueOnce(okJson({ place_id: 1 }));

    const result = await dataFetcher(
      "search",
      new URLSearchParams({ format: "json" }),
    );

    expect(result).toStrictEqual({ place_id: 1 });
  });

  it("returns raw text when format is text or xml", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("OK", { status: 200 }));

    const result = await dataFetcher(
      "status",
      new URLSearchParams({ format: "text" }),
    );

    expect(result).toBe("OK");
  });

  it("throws HttpRequestError on non-2xx responses with endpoint metadata", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response("nope", { status: 404, statusText: "Not Found" }),
    );

    await expect(
      dataFetcher("search", new URLSearchParams({ format: "json" })),
    ).rejects.toMatchObject({
      name: "HttpRequestError",
      statusCode: 404,
      metadata: { endpoint: "search" },
    });
  });

  it("maps 429 to HTTP_RATE_LIMIT code", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response("slow down", { status: 429, statusText: "Too Many" }),
    );

    await expect(
      dataFetcher("search", new URLSearchParams({ format: "json" })),
    ).rejects.toMatchObject({ code: "HTTP_RATE_LIMIT" });
  });

  it("wraps fetch errors as NetworkRequestError", async () => {
    const cause = new Error("ECONNRESET");
    fetchSpy.mockRejectedValueOnce(cause);

    const error = await dataFetcher(
      "search",
      new URLSearchParams({ format: "json" }),
    ).catch((error_: unknown) => error_);

    expect(error).toBeInstanceOf(NetworkRequestError);
    expect((error as NetworkRequestError).cause).toBe(cause);
  });
});
