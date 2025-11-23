import type { AsRuntimeToken, RuntimeBaseType,  RuntimeTokenCallback } from "~";
import { createFnWithProps, EN_SPACE, narrow, Never,  THIN_SPACE } from "inferred-types";
import { isBaseTokenType, isRuntimeToken, isRuntimeTokenCallback } from "~";

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
export function asRuntimeToken<
    const T,
>(token: T): T extends RuntimeTokenCallback ? ReturnType<T> : AsRuntimeToken<T> {

    return (
        isRuntimeToken(token)
            ? token
            : isRuntimeTokenCallback(token)
            ? token()
            : isBaseTokenType(token)
            ? `${TOKEN_START}${token}${TOKEN_END}`
            : Never
    ) as T extends RuntimeTokenCallback ? ReturnType<T> : AsRuntimeToken<T>

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
