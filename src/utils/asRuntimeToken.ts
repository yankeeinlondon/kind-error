import { createFnWithProps } from "inferred-types";
import { AsRuntimeToken, isRuntimeToken, RuntimeBaseType, RuntimeToken } from "~";
import { TOKEN_END, TOKEN_START } from "./schema";

/**
 * Converts the _payload_ of a `RuntimeToken` into a delimited, fully fledged `RuntimeToken`.
 * 
 * - will proxy through any `Runtime` token which is passed in.
 * - will convert any literal Scalar to a tokenized version 
 */
export function asRuntimeToken<
    T extends `${RuntimeBaseType}${string}` | RuntimeToken
>(token: T): AsRuntimeToken<T>  {
    return isRuntimeToken(token) 
        ? token as AsRuntimeToken<T>
        : `${TOKEN_START}${token}${TOKEN_END}` as AsRuntimeToken<T>
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
    T extends `${RuntimeBaseType}${string}`
>(token: T) {
  return createFnWithProps(() => `${TOKEN_START}${asRuntimeToken(token)}${TOKEN_END}`, { kind: "RuntimeToken" });
}
