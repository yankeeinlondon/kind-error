import type { AsRuntimeToken, RuntimeBaseType, RuntimeToken, RuntimeTokenCallback } from "~";
import { createFnWithProps, EN_SPACE, narrow, Never, THIN_SPACE } from "inferred-types";
import { isBaseTokenType } from "../type-guards/isBaseTokenType";
import { isRuntimeToken, isRuntimeTokenCallback } from "../type-guards/isRuntimeToken";

export const UNION_DELIMITER = `${EN_SPACE}|${EN_SPACE}` as const;
export const COMMA_DELIMITER = `,${EN_SPACE}` as const;
export const TOKEN_START = narrow(`<<${THIN_SPACE}`);
export const TOKEN_END = `${THIN_SPACE}>>` as const;

/**
 * Converts the _payload_ of a `RuntimeToken` into a delimited, fully fledged `RuntimeToken`.
 *
 * - will proxy through any `Runtime` token which is passed in.
 * - will convert any literal Scalar to a tokenized version
 * - will wrap a `RuntimeTypeBase` string with starting and ending token delimiters
 */
export function asRuntimeToken<R extends RuntimeToken>(token: RuntimeTokenCallback<R>): R;
export function asRuntimeToken<T>(token: T): AsRuntimeToken<T>;
export function asRuntimeToken(token: unknown): unknown {
  return (
    isRuntimeToken(token)
      ? token
      : isRuntimeTokenCallback(token)
        ? token()
        : isBaseTokenType(token)
          ? `${TOKEN_START}${token}${TOKEN_END}`
          : Never
  );
}

/**
 * **asToken**`(fn)`
 *
 * Adds the KV `{ kind: "RuntimeToken" }` to the passed in function to make it a
 * `RuntimeToken` type.
 *
 * - you can also just pass in the `RuntimeToken` and it will also be converted
 * to a `RuntimeTokenCallback`
 * - you can also just pass in the text _other than_ the delimiters
 */
export function asRuntimeTokenCallback<
  T extends `${RuntimeBaseType}${string}`,
>(token: T) {
  return createFnWithProps(() => asRuntimeToken(token), { kind: "RuntimeToken" });
}
