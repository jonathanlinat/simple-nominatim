// SPDX-License-Identifier: MIT

import type { SearchOptions } from "../_shared/_shared.types";
import { dataFetcher } from "../_shared/dataFetcher";
import { appendParams } from "../_shared/queryParams";

import type { FreeFormSearchParams } from "./search.types";

export const freeFormSearch = async <T = unknown>(
  params: FreeFormSearchParams,
  options: SearchOptions,
): Promise<T> => {
  const urlSearchParams = new URLSearchParams();

  appendParams(urlSearchParams, { q: params.query }, Boolean);

  const { baseUrl, userAgent, ...apiOptions } = options;

  appendParams(urlSearchParams, apiOptions);

  return dataFetcher<T>("search", urlSearchParams, { baseUrl, userAgent });
};
