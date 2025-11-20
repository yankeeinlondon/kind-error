import type { KindStackItem } from "~/types";
import { parse } from "error-stack-parser-es/lite";
import { relative } from "pathe";

const IGNORABLES = ["@vitest/runner", "node:", "native"];

/**
 * converts a normal Javascript _stack_ string into a structured
 * stack trace.
 */
export function toStackTrace(stack: string, skip: number = 0): KindStackItem[] {
  const err = new Error("Stack Parser");
  err.stack = stack;

  try {
    return parse(err)
      .filter(i => !IGNORABLES.some(has => i.file && i.file.includes(has)))
      .map(i => ({
        ...i,
        file: i.file ? relative(".", i.file) : undefined,
      }))
      .slice(skip);
  }
  catch (e) {
    console.warn(`Failed to parse stack trace: ${e instanceof Error ? e.message : String(e)}`);
    return [];
  }
}
