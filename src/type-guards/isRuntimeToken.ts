import { isFunction } from "inferred-types";
import { RuntimeToken } from "~/types";

/**
 * A type guard which checks whether `val` is a `RuntimeToken`.
 */
export function isRuntimeToken(val: unknown): val is RuntimeToken {
    return isFunction(val) && "kind" in val && val.kind === "RuntimeToken"
}
