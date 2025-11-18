import { isObject } from "inferred-types";

/**
 * A type guard which tests whether `val` is a `Response` object from the
 * **fetch** API.
 * 
 * **Related:** `isFetchError()`
 */
export function isFetchResponse(val: unknown): val is Response {
    return isObject(val) 
        && "ok" in val 
        && typeof val.ok === "boolean"
        && "body" in val
        && "statusText" in val;
}
