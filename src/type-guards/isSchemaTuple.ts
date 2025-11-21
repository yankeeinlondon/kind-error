import { isArray } from "inferred-types";
import { RuntimeToken } from "~/types";
import { isRuntimeToken } from "./isRuntimeToken";


/**
 * **isSchemaTuple**`(val) -> RuntimeToken[]`
 * 
 * type guard whether `val` 
 */
export function isSchemaTuple(val: unknown): val is readonly RuntimeToken[] {
    return isArray(val) && val.every(i => isRuntimeToken(i))
}
