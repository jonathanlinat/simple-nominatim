// SPDX-License-Identifier: MIT

import { serviceStatus } from "@simple-nominatim/core";

import { runCommand, validateOrThrow } from "../_shared/commandHarness";
import { serviceStatusSchema } from "../_shared/validation";

import type { ServiceStatusArgv } from "./status.types";

export const serviceStatusWrapper = (argv: ServiceStatusArgv): Promise<void> =>
  runCommand(() => {
    const format = argv.format ?? "text";

    validateOrThrow(serviceStatusSchema, { statusFormat: format });

    return serviceStatus({ format });
  });
