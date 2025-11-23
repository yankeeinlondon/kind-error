import { BaseTypeToken, isString } from "inferred-types";
import { RUNTIME_BASE_TYPES } from "~";

export function isBaseTokenType(val: unknown): val is BaseTypeToken {
    return isString(val) && RUNTIME_BASE_TYPES.includes(val as any)
}
