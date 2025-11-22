import type { Stringifyable } from "~/types";
import { isArray, isNumber, isObject, isString } from "inferred-types";

export function isStringifyable(val: unknown): val is Stringifyable {
  return isString(val) || isNumber(val) || isObject(val) || isArray(val);
}
