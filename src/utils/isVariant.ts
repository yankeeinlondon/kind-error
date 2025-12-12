import { isFunction, isString } from "inferred-types";
import type { IsVariantResult } from "~/types";

/**
 * **isVariant**`(val) -> boolean`
 *
 * Tests whether the value passed in represents a _variant_ type.
 *
 * - used to determine whether key/value pairs in the `KindErrorType`'s
 *   context schema are a static value/type literal or a _variant_ type
 *   reference.
 */
export function isVariant<const T>(val: T): IsVariantResult<T> {
  if (isFunction(val)) {
    return true as IsVariantResult<T>;
  }

  return (
    isString(val)
      ? val.startsWith("<<") && val.endsWith(">>")
        ? true
        : ["string", "number", "object", "array", "boolean"].includes(val)
            ? true
            : val.endsWith("[]")
              ? true
              : val.startsWith("Record<") && val.endsWith(">")
                ? true
                : val.startsWith("Map<") && val.endsWith(">")
                  ? true
                  : val.startsWith("Array<") && val.endsWith(">")
                    ? true
                    : val.startsWith("WeakMap<") && val.endsWith(">")
                      ? true
                      : val.startsWith("[") && val.endsWith("]")
                        ? true
                        : val.startsWith("{") && val.endsWith("}")
                          ? true
                          : !!val.includes("|")
      : false
  ) as IsVariantResult<T>;
}
