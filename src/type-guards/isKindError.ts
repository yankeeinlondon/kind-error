import type { KindError } from "~/types";
import {isString } from "inferred-types";
import { isError } from "./isError";



/**
 * Type guard to detect whether `val` passed in is a `KindError`.
 * 
 * - you may _optionally_ test for a specific `kind` of `KindError`
 */
export function isKindError<
  K extends string | undefined,
>(
  val: unknown,
  kind: K = undefined as K,
): val is K extends string ? KindError<K> : KindError {
  return isError(val)
    && "__kind" in val && val.__kind === "KindError"
    && "kind" in val
    && "type" in val
    && "stackTrace" in val
    && (
        (isString(kind) && val.kind === kind) ||
        (!isString(kind))
    )
}
