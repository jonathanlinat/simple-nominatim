// SPDX-License-Identifier: MIT

import {
  isRequestError,
  type RequestError,
  type RequestErrorCode,
} from "@simple-nominatim/core";
import type { z } from "zod";

import { formatValidationError } from "./validation";

const EXIT_GENERIC = 1;
const EXIT_VALIDATION = 2;
const EXIT_UPSTREAM = 3;
const EXIT_TRANSPORT = 4;

export class CliValidationError extends Error {
  readonly code = "VALIDATION_ERROR";

  constructor(message: string) {
    super(message);

    this.name = "CliValidationError";
  }
}

export const validateOrThrow = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): void => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new CliValidationError(
      formatValidationError(result.error).join("\n"),
    );
  }
};

type ErrorKey = RequestErrorCode | "HTTP_UNAVAILABLE";

const ERROR_TABLE: Record<ErrorKey, { message: string; exit: number }> = {
  HTTP_RATE_LIMIT: {
    message:
      "Rate limit exceeded. Please try again later or reduce request frequency.",
    exit: EXIT_UPSTREAM,
  },
  HTTP_UNAVAILABLE: {
    message: "Nominatim API is currently unavailable. Please try again later.",
    exit: EXIT_UPSTREAM,
  },
  HTTP_ERROR: {
    message: "Request failed. Please check your parameters and try again.",
    exit: EXIT_UPSTREAM,
  },
  NETWORK_ERROR: {
    message:
      "Network connection failed. Please check your internet connection.",
    exit: EXIT_TRANSPORT,
  },
};

const errorKey = (error: RequestError): ErrorKey =>
  error.code === "HTTP_ERROR" && (error.statusCode ?? 0) >= 500
    ? "HTTP_UNAVAILABLE"
    : error.code;

const classify = (error: unknown): { message: string; exit: number } => {
  if (error instanceof CliValidationError) {
    return { message: error.message, exit: EXIT_VALIDATION };
  }

  if (isRequestError(error)) {
    return ERROR_TABLE[errorKey(error)];
  }

  const message = error instanceof Error ? error.message : String(error);

  return { message: `Error: ${message}`, exit: EXIT_GENERIC };
};

export const getCliErrorMessage = (error: unknown): string =>
  classify(error).message;

export const getCliExitCode = (error: unknown): number => classify(error).exit;

export const runCommand = async <T>(
  execute: () => Promise<T>,
): Promise<void> => {
  try {
    const response = await execute();

    console.log(
      typeof response === "string" ? response : JSON.stringify(response),
    );
  } catch (error) {
    const { message, exit } = classify(error);

    console.error(message);
    process.exit(exit);
  }
};
