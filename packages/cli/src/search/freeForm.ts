// SPDX-License-Identifier: MIT

import { freeFormSearch } from "@simple-nominatim/core";

import { buildSearchApiOptions } from "../_shared/apiOptions";
import { runCommand, validateOrThrow } from "../_shared/commandHarness";
import { freeFormSearchSchema } from "../_shared/validation";

import type { FreeFormArgv } from "./search.types";

export const freeFormSearchWrapper = (argv: FreeFormArgv): Promise<void> =>
  runCommand(() => {
    const { query, email, format, limit } = argv;

    validateOrThrow(freeFormSearchSchema, {
      query,
      outputFormat: format,
      email,
      limit,
    });

    return freeFormSearch({ query }, buildSearchApiOptions(argv));
  });
