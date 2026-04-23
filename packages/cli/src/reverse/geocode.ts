// SPDX-License-Identifier: MIT

import { geocodeReverse } from "@simple-nominatim/core";

import { buildReverseApiOptions } from "../_shared/apiOptions";
import { runCommand, validateOrThrow } from "../_shared/commandHarness";
import { reverseGeocodeSchema } from "../_shared/validation";

import type { GeocodeReverseArgv } from "./reverse.types";

export const geocodeReverseWrapper = (
  argv: GeocodeReverseArgv,
): Promise<void> =>
  runCommand(() => {
    const { latitude, longitude, email, format } = argv;

    validateOrThrow(reverseGeocodeSchema, {
      latitude,
      longitude,
      outputFormat: format,
      email,
    });

    return geocodeReverse(
      { latitude, longitude },
      buildReverseApiOptions(argv),
    );
  });
