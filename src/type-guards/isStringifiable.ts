import type { Stringifiable } from "src/types";
import { isArray, isNumber, isObject, isString } from "inferred-types";

export function isStringifiable(val: unknown): val is Stringifiable {
  return isString(val) || isNumber(val) || isObject(val) || isArray(val);
}
