/**
 * MIT License
 *
 * Copyright (c) 2023-2025 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { execa } from "execa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Path to the CLI entry point (using tsx for E2E tests)
 */
const CLI_PATH = resolve(__dirname, "../../index.ts");

/**
 * Execute the CLI command with given arguments
 *
 * @param args Command line arguments to pass to the CLI
 * @returns Promise that resolves with the execution result
 */
export const runCli = async (args: string[]) => {
  const result = await execa("tsx", [CLI_PATH, ...args], {
    env: {
      NODE_ENV: "test",
    },
    reject: false,
  });

  return {
    exitCode: result.exitCode,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};

/**
 * Parse JSON output from CLI
 *
 * @param stdout Standard output from CLI execution
 * @returns Parsed JSON object
 */
export const parseJsonOutput = <T = unknown>(
  stdout: string | string[] | Uint8Array | unknown[] | undefined,
): T => {
  if (!stdout) {
    throw new Error("stdout is undefined or empty");
  }

  const output = typeof stdout === "string" ? stdout : String(stdout);

  return JSON.parse(output) as T;
};

/**
 * Sleep utility for rate limiting between tests
 *
 * @param ms Milliseconds to sleep
 * @returns Promise that resolves after the delay
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
