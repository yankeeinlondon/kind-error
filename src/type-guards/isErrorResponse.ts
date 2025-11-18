import type { ErrorResponse } from "~/types";
import { isObject } from "inferred-types/runtime";

/**
 * tests that the `val` passed in is a failed `Response` object
 */
export function isErrorResponse(val: unknown): val is ErrorResponse {
  return isObject(val) && val instanceof Response && val.ok === false;
}
