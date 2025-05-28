import type { JsError } from "src/types";

export function isError(val: unknown): val is JsError {
  return val instanceof Error;
}
