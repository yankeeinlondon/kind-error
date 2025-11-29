import type { IsBoolean, IsFalse, IsNull, IsTrue, IsUndefined, Scalar } from "inferred-types";
import type { TOKEN_END, TOKEN_START } from "~/utils";
import { narrow } from "inferred-types";

export const RUNTIME_BASE_TYPES = narrow(
  "string",
  "optString",
  "startsWith",
  "optStartsWith",
  "endsWith",
  "optEndsWith",
  "suggest",
  "number",
  "optNumber",
  "bigint",
  "optBigint",
  "null",
  "optNull",
  "undefined",
  "true",
  "optTrue",
  "false",
  "optFalse",
  "boolean",
  "optBoolean",
  "tuple",
  "optTuple",
  "array",
  "optArray",
  "record",
  "optRecord",
  "dictionary",
  "optDictionary",
  "map",
  "optMap",
  "set",
  "optSet",
  "weakmap",
  "optWeakmap",
  "union",
  "email",
  "optEmail",
  "ip4Address",
  "optIp4Address",
);

export type RuntimeBaseType = typeof RUNTIME_BASE_TYPES[number];

/**
 * **RuntimeToken**`<[T]>`
 *
 * A delimited runtime token which contains an interior string value
 * which _represents_ a type in the type system.
 */
export type RuntimeToken<
  T extends `${RuntimeBaseType}${string}` = `${RuntimeBaseType}${string}`,
> = `${typeof TOKEN_START}${T}${typeof TOKEN_END}`;

export type AsRuntimeToken<T extends Scalar | RuntimeTokens> = T extends RuntimeToken
  ? T
  : T extends `${RuntimeBaseType}${string}`
    ? RuntimeToken<T>
    : T extends Scalar
      ? T extends string
        ? RuntimeToken<`string::${T}`>
        : T extends number
          ? RuntimeToken<`number::${T}`>
          : T extends bigint
            ? RuntimeToken<`bigint`>
            : IsNull<T> extends true
              ? RuntimeToken<`null`>
              : IsUndefined<T> extends true
                ? RuntimeToken<`undefined`>
                : IsBoolean<T> extends true
                  ? IsTrue<T> extends true
                    ? RuntimeToken<`true`>
                    : IsFalse<T> extends true
                      ? RuntimeToken<`false`>
                      : RuntimeToken<`boolean`>
                  : never
      : never;

/**
 * **RuntimeTokenCallback**
 *
 * A callback function which returns a `RuntimeToken` and
 * can be distinguished at runtime by the key value of
 * `{ kind: "RuntimeToken" }`.
 */
export type RuntimeTokenCallback<
  T extends RuntimeToken = RuntimeToken,
> = (() => T) & { kind: "RuntimeToken" };
