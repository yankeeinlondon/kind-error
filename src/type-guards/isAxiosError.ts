import { isObject } from "inferred-types";
import { AxiosError } from "~/types";

/**
 * type guard which checks whether `val` is an `AxiosError`
 */
export function isAxiosError(val: unknown): val is AxiosError {
    return isObject(val) && "name" in val && val.name === "AxiosError"
}
