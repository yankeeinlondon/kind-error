import type { AsRuntimeToken } from "~/types";
import { isArray } from "inferred-types";
import { isRuntimeToken } from "./isRuntimeToken";

/**
 * **isSchemaTuple**`(val) -> RuntimeToken[]`
 *
 * type guard whether `val`
 */
export function isSchemaTuple(val: unknown): val is readonly AsRuntimeToken[] {
  return isArray(val) && val.every(i => isRuntimeToken(i));
}
