import type { AsRuntimeToken, RuntimeBaseType, RuntimeToken } from "~";
import { createFnWithProps, EN_SPACE, narrow, THIN_SPACE } from "inferred-types";
import { isRuntimeToken } from "~";

export const UNION_DELIMITER = `${EN_SPACE}|${EN_SPACE}` as const;
export const COMMA_DELIMITER = `,${EN_SPACE}` as const;
export const TOKEN_START = narrow(`<<${THIN_SPACE}`);
export const TOKEN_END = `${THIN_SPACE}>>` as const;

/**
 * Converts the _payload_ of a `RuntimeToken` into a delimited, fully fledged `RuntimeToken`.
 *
 * - will proxy through any `Runtime` token which is passed in.
 * - will convert any literal Scalar to a tokenized version
 */
export function asRuntimeToken<
  T extends `${RuntimeBaseType}${string}` | RuntimeToken,
>(token: T): AsRuntimeToken<T> {
  if (isRuntimeToken(token)) {
    return token as AsRuntimeToken<T>;
  }
  const t = String(token);

  return (
    t.startsWith(TOKEN_START) && t.endsWith(TOKEN_END)
      ? t
      : `${TOKEN_START}${t}${TOKEN_END}`
  ) as AsRuntimeToken<T>;
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
