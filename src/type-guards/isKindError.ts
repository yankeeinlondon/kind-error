import type { KindError } from "~/types";
import {isString, KebabCase, toKebabCase } from "inferred-types";
import { isError } from "./isError";


/**
 * Type guard to detect whether `val` passed in is a `KindError`.
 * 
 * - you may _optionally_ test for a specific `kind` of `KindError`
 * - when testing for a specific "kind" the _comparator_ and _kind_ are normalized
 *   to a kebab cased variant to increase matching likelihood
 *     - this is meant as convenience to the caller; if you want a stricter
 *       matching then use the `KindErrorType`'s `is(val)` type guard.
 */
export function isKindError<
  K extends string | undefined,
>(
  val: unknown,
  kind: K = undefined as K,
): val is K extends string ? KindError<KebabCase<K>> : KindError {
  return isError(val)
    && "__kind" in val && val.__kind === "KindError"
    && "kind" in val
    && "type" in val
    && "stackTrace" in val
    && (
        (isString(kind) && isString(val.kind) && toKebabCase(val.kind) === toKebabCase(kind)) ||
        (!isString(kind))
    )
}
