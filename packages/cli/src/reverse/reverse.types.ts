// SPDX-License-Identifier: MIT

import type { OutputFormat } from "@simple-nominatim/core";

import type { CommonApiArgv } from "../_shared/argv.types";

export interface GeocodeReverseArgv extends CommonApiArgv {
  email?: string;
  format: OutputFormat;
  latitude: string;
  longitude: string;
  zoom?: number;
}
