// SPDX-License-Identifier: MIT

type QueryParamsValue = string | number | boolean | undefined;
type QueryParamsInput = Record<string, QueryParamsValue>;

export const appendParams = (
  target: URLSearchParams,
  source: QueryParamsInput,
  predicate: (value: QueryParamsValue) => boolean = (value) =>
    value !== undefined,
): void => {
  for (const [key, value] of Object.entries(source)) {
    if (predicate(value)) {
      target.append(key, String(value));
    }
  }
};
