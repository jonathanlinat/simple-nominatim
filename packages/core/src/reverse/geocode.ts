// SPDX-License-Identifier: MIT

import type { ReverseOptions } from "../_shared/_shared.types";
import { dataFetcher } from "../_shared/dataFetcher";
import { appendParams } from "../_shared/queryParams";

import type { GeocodeReverseParams } from "./reverse.types";

export const geocodeReverse = async <T = unknown>(
  params: GeocodeReverseParams,
  options: ReverseOptions,
): Promise<T> => {
  const urlSearchParams = new URLSearchParams();

  appendParams(
    urlSearchParams,
    { lat: params.latitude, lon: params.longitude },
    Boolean,
  );

  const { baseUrl, userAgent, ...apiOptions } = options;

  appendParams(urlSearchParams, apiOptions);

  return dataFetcher<T>("reverse", urlSearchParams, { baseUrl, userAgent });
};
