import type { AxiosError } from "~/types";
import { isObject } from "inferred-types";

/**
 * type guard which checks whether `val` is an `AxiosError`
 */
export function isAxiosError(val: unknown): val is AxiosError {
  return isObject(val) && "name" in val && val.name === "AxiosError";
}
