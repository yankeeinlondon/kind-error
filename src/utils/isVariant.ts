import { isString, Not } from "inferred-types";
import { IsNonVariant } from "~/types";

/**
 * **isVariant**`(val) -> boolean`
 * 
 * Tests whether the value passed in represents a _variant_ type.
 * 
 * - used to determine whether key/value pairs in the `KindErrorType`'s 
 *   context schema are a static value/type literal or a _variant_ type
 *   reference.
 */
export function isVariant<const T>(val: T): Not<IsNonVariant<T>> {
    return (
        isString(val)
            ? ["string","number","object","array", "boolean"].includes(val)
                ? true as Not<IsNonVariant<T>>
            : val.endsWith("[]")
                ? true as Not<IsNonVariant<T>>
            : val.startsWith("Record<") && val.endsWith(">")
                ? true as Not<IsNonVariant<T>>
            : val.startsWith("Map<") && val.endsWith(">")
                ? true as Not<IsNonVariant<T>>
            : val.startsWith("Array<") && val.endsWith(">")
                ? true as Not<IsNonVariant<T>>
            : val.startsWith("WeakMap<") && val.endsWith(">")
                ? true as Not<IsNonVariant<T>>
            : val.startsWith("[") && val.endsWith("]")
                ? true as Not<IsNonVariant<T>>
            : val.startsWith("{") && val.endsWith("}")
                ? true as Not<IsNonVariant<T>>
            : val.includes("|")
                ? true as Not<IsNonVariant<T>>
            : false  as Not<IsNonVariant<T>>
        : false  as Not<IsNonVariant<T>>
    )
}
