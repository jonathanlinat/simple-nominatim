// SPDX-License-Identifier: MIT

import type { OutputFormat } from "@simple-nominatim/core";

import type { CommonApiArgv, SearchFilterArgv } from "../_shared/argv.types";

interface SearchArgvBase extends CommonApiArgv, SearchFilterArgv {
  email?: string;
  format: OutputFormat;
  limit?: number;
}

export interface FreeFormArgv extends SearchArgvBase {
  query: string;
}

export interface StructuredArgv extends SearchArgvBase {
  amenity?: string;
  city?: string;
  country?: string;
  county?: string;
  postalCode?: string;
  state?: string;
  street?: string;
}
