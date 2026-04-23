// SPDX-License-Identifier: MIT

import { structuredSearch } from "@simple-nominatim/core";

import { buildSearchApiOptions } from "../_shared/apiOptions";
import { runCommand, validateOrThrow } from "../_shared/commandHarness";
import { structuredSearchSchema } from "../_shared/validation";

import type { StructuredArgv } from "./search.types";

export const structuredSearchWrapper = (argv: StructuredArgv): Promise<void> =>
  runCommand(() => {
    const {
      amenity,
      city,
      country,
      county,
      email,
      format,
      limit,
      postalCode,
      state,
      street,
    } = argv;

    validateOrThrow(structuredSearchSchema, {
      country,
      outputFormat: format,
      amenity,
      city,
      county,
      email,
      limit,
      postalCode,
      state,
      street,
    });

    return structuredSearch(
      {
        amenity,
        city,
        country,
        county,
        postalcode: postalCode,
        state,
        street,
      },
      buildSearchApiOptions(argv),
    );
  });
