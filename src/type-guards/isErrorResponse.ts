import type { ErrorResponse } from "src/types";
import { isObject } from "inferred-types";

/**
 * tests that the `val` passed in is a failed `Response` object
 */
export function isErrorResponse(val: unknown): val is ErrorResponse {
  return isObject(val) && val instanceof Response && val.ok === false;
}
