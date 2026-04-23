// SPDX-License-Identifier: MIT

export type StatusFormat = "text" | "json";

export interface StatusSuccessResponse {
  status: 0;
  message: "OK";
  data_updated: string;
  software_version: string;
  database_version: string;
}

export interface StatusErrorResponse {
  status: number;
  message: string;
}

export type StatusJsonResponse = StatusSuccessResponse | StatusErrorResponse;

export const isStatusSuccess = (
  response: StatusJsonResponse,
): response is StatusSuccessResponse => response.status === 0;

export interface StatusOptions {
  format?: StatusFormat;
  baseUrl?: string;
  userAgent?: string;
}
