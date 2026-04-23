// SPDX-License-Identifier: MIT

import type { SearchOptions } from "../_shared/_shared.types";
import { dataFetcher } from "../_shared/dataFetcher";
import { appendParams } from "../_shared/queryParams";

import type { StructuredSearchParams } from "./search.types";

export const structuredSearch = async <T = unknown>(
  params: StructuredSearchParams,
  options: SearchOptions,
): Promise<T> => {
  const urlSearchParams = new URLSearchParams();

  appendParams(urlSearchParams, params, Boolean);

  const { baseUrl, userAgent, ...apiOptions } = options;

  appendParams(urlSearchParams, apiOptions);

  return dataFetcher<T>("search", urlSearchParams, { baseUrl, userAgent });
};
