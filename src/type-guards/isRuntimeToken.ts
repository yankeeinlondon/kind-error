import { isFunction } from "inferred-types";
import { RuntimeToken, RuntimeTokenCallback } from "~/types";

/**
 * A type guard which checks whether `val` is a `RuntimeTokenCallback`.
 * 
 * #### Notes:
 * 
 * - a `RuntimeToken` is identifiable as a function which includes
 *   the key/value `{ kind: "RuntimeToken" }`.
 * - the function _never_ takes any values so can be called without
 *   any additional context
 * - the interior content of a `RuntimeToken` when called is:
 *     - all Scalar types, wide arrays, Maps, Sets, and WeakMaps being represented 
 *       will have a `<<${string}>>` string representation.
 *     - the **Tuple** and **Dictionary** representations -- which can define _types_
 *       more granularly and contain a combination of literal type/values along with
 *       token representations -- will retain their **structure** at the outer layer
 *       but will then define each element/value as either: 
 *         - a non-variant literal type and value (because a _non-variant_ can only 
 *           represent a single value the type and the value are one and the same)
 *         - a `RuntimeToken`
 *     - providing the _lazy loading_ of interior content of Dictionary's and Tuple's
 *       allows structural evaluation of these tokens while maintaining clear distinction
 *       between literal type/values and those defined via a callback mechanism.
 * 
 * #### Examples:
 * 
 * ```ts
 * // string
 * const scalar = schemaProperty(t => t.string());
 * // (string | number)[]
 * const wideArray = schemaProperty(t => t.array("string","number"))
 * // { foo: "foo", bar: }
 * const dictionary = schemaProperty(t => t.dictionary({ foo: "foo", bar: t => }))
 * 
 * const scalar = isRuntimeToken(
 * )
 * ```
 */
export function isRuntimeTokenCallback(val: unknown): val is RuntimeTokenCallback {
    return isFunction(val) && "kind" in val && val.kind === "RuntimeToken";
}




export function isRuntimeToken(val: unknown): val is RuntimeToken {
  return isFunction(val) && "kind" in val && val.kind === "RuntimeToken";
}
