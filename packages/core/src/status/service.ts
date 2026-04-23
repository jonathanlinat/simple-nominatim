// SPDX-License-Identifier: MIT

import { dataFetcher } from "../_shared/dataFetcher";
import { appendParams } from "../_shared/queryParams";

import type { StatusOptions } from "./status.types";

export const serviceStatus = async <T = unknown>(
  options: StatusOptions = {},
): Promise<T> => {
  const urlSearchParams = new URLSearchParams();
  const { baseUrl, userAgent, format = "text", ...apiOptions } = options;

  urlSearchParams.append("format", format);
  appendParams(urlSearchParams, apiOptions);

  return dataFetcher<T>("status", urlSearchParams, { baseUrl, userAgent });
};
