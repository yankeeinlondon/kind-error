import type { FetchError } from "~/types";
import { isObject } from "inferred-types/runtime";

/**
 * type guard which tests whether `val` is a failed `Response` object
 * from a `fetch` call.
 */
export function isFetchError(val: unknown): val is FetchError {
  return isObject(val) && val instanceof Response && val.ok === false;
}
