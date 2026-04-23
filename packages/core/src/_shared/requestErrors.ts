// SPDX-License-Identifier: MIT

export type RequestErrorCode =
  | "HTTP_ERROR"
  | "HTTP_RATE_LIMIT"
  | "NETWORK_ERROR";

export interface RequestErrorMetadata {
  endpoint?: string;
  requestUrl?: string;
}

export class RequestError extends Error {
  readonly code: RequestErrorCode;
  readonly statusCode?: number;
  readonly metadata?: RequestErrorMetadata;
  override readonly cause?: unknown;

  constructor(
    message: string,
    options: {
      code: RequestErrorCode;
      statusCode?: number;
      metadata?: RequestErrorMetadata;
      cause?: unknown;
    },
  ) {
    super(message);

    this.name = "RequestError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.metadata = options.metadata;
    this.cause = options.cause;
  }
}

export const isRequestError = (error: unknown): error is RequestError =>
  error instanceof RequestError;

export class HttpRequestError extends RequestError {
  override readonly statusCode: number;
  readonly statusText: string;

  constructor(
    statusCode: number,
    statusText: string,
    metadata?: RequestErrorMetadata,
  ) {
    super(`HTTP error! Status: ${statusCode}. Text: ${statusText}`, {
      code: statusCode === 429 ? "HTTP_RATE_LIMIT" : "HTTP_ERROR",
      statusCode,
      metadata,
    });

    this.name = "HttpRequestError";
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

export class NetworkRequestError extends RequestError {
  constructor(
    message: string,
    cause?: unknown,
    metadata?: RequestErrorMetadata,
  ) {
    super(message, { code: "NETWORK_ERROR", cause, metadata });

    this.name = "NetworkRequestError";
  }
}
