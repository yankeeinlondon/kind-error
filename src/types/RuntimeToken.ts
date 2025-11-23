import { TOKEN_END, TOKEN_START } from "~/utils";


export type RuntimeBaseType = 
| "string"
| "optString"
| "startsWith"
| "optStartsWith"
| "endsWith"
| "optEndsWith"
| "suggest"
| "number"
| "optNumber"
| "bigint"
| "optBigint"
| "null"
| "optNull"
| "undefined"
| "true"
| "optTrue"
| "false"
| "optFalse"
| "boolean"
| "optBoolean"
| "tuple"
| "optTuple"
| "array"
| "optArray"
| "record"
| "optRecord"
| "dictionary"
| "optDictionary"
| "map"
| "optMap"
| "set"
| "optSet"
| "weakmap"
| "optWeakmap"
| "union"
| "email"
| "optEmail"
| "ip4Address"
| "optIp4Address";

/**
 * **RuntimeToken**`<[T]>`
 * 
 * A delimited runtime token which contains an interior string value
 * which _represents_ a type in the type system.
 */
export type RuntimeToken<T extends `${RuntimeBaseType}${string}` = `${RuntimeBaseType}${string}`> = `${typeof TOKEN_START}${T}${typeof TOKEN_END}`;


export type AsRuntimeToken<T extends `${RuntimeBaseType}${string}` | RuntimeToken> = T extends RuntimeToken
? T
: T extends `${RuntimeBaseType}${string}`
    ? RuntimeToken<T>
: never;

/**
 * **RuntimeTokenCallback**
 *
 * A callback function which returns a `RuntimeToken` and
 * can be distinguished at runtime by the key value of
 * `{ kind: "RuntimeToken" }`.
 */
export type RuntimeTokenCallback<
    T extends RuntimeToken = RuntimeToken
> = (() => T) & { kind: "RuntimeToken" };
