import type { JsError } from "~/types";

export function isError(val: unknown): val is JsError {
  return val instanceof Error;
}
