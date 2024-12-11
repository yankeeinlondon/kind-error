import type { KindError } from "./types";
import { isObject } from "inferred-types";

export function isError(val: unknown): val is Error {
  return isObject(val);
}

/**
 * Type guard to detect whether `val` passed in is a `KindError`.
 */
export function isKindError(val: unknown): val is KindError<any, any> {
  return isError(val) && "__kind" in val && val.__kind === "KindError";
}
