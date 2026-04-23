// SPDX-License-Identifier: MIT

export { freeFormSearch } from "./search/freeForm";
export { structuredSearch } from "./search/structured";
export { geocodeReverse } from "./reverse/geocode";
export { serviceStatus } from "./status/service";

export type {
  OutputFormat,
  ReverseOptions,
  SearchOptions,
} from "./_shared/_shared.types";
export type {
  FreeFormSearchParams,
  StructuredSearchParams,
} from "./search/search.types";
export type { GeocodeReverseParams } from "./reverse/reverse.types";
export {
  isStatusSuccess,
  type StatusErrorResponse,
  type StatusFormat,
  type StatusJsonResponse,
  type StatusOptions,
  type StatusSuccessResponse,
} from "./status/status.types";

export {
  HttpRequestError,
  isRequestError,
  NetworkRequestError,
  RequestError,
  type RequestErrorCode,
} from "./_shared/requestErrors";
