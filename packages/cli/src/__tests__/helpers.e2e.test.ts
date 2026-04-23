// SPDX-License-Identifier: MIT

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { execa } from "execa";

const here = dirname(fileURLToPath(import.meta.url));

const CLI_PATH = resolve(here, "../index.ts");
const CLI_PKG_DIR = resolve(here, "../..");

export const runCli = async (args: string[]) => {
  const result = await execa("tsx", [CLI_PATH, ...args], {
    env: { NODE_ENV: "test" },
    preferLocal: true,
    localDir: CLI_PKG_DIR,
    reject: false,
  });

  return {
    exitCode: result.exitCode,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};

export const parseJsonOutput = <T = unknown>(
  stdout: string | string[] | Uint8Array | unknown[] | undefined,
): T => {
  if (!stdout) {
    throw new Error("stdout is empty");
  }

  return JSON.parse(typeof stdout === "string" ? stdout : String(stdout)) as T;
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
