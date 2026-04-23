// SPDX-License-Identifier: MIT

import type { BaseOptions } from "./_shared.types";
import { FETCHER_BASE_URL, FETCHER_USER_AGENT } from "./constants";
import {
  HttpRequestError,
  NetworkRequestError,
  RequestError,
} from "./requestErrors";

type TransportOptions = Pick<BaseOptions, "baseUrl" | "userAgent">;

const parseResponse = async <T>(
  response: Response,
  params: URLSearchParams,
): Promise<T> => {
  const format = params.get("format");
  const isText = format === "text" || format === "xml";

  return isText
    ? ((await response.text()) as T)
    : ((await response.json()) as T);
};

export const dataFetcher = async <T = unknown>(
  endpoint: string,
  params: URLSearchParams,
  options: TransportOptions = {},
): Promise<T> => {
  const baseUrl = (options.baseUrl ?? FETCHER_BASE_URL).replace(/\/+$/, "");
  const userAgent = options.userAgent ?? FETCHER_USER_AGENT;
  const requestUrl = `${baseUrl}/${endpoint}?${params.toString()}`;

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      headers: { "User-Agent": userAgent },
    });
  } catch (error) {
    if (error instanceof RequestError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);

    throw new NetworkRequestError(message, error, { endpoint, requestUrl });
  }

  if (!response.ok) {
    throw new HttpRequestError(response.status, response.statusText, {
      endpoint,
      requestUrl,
    });
  }

  return parseResponse<T>(response, params);
};
