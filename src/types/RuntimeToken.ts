import { TOKEN_END, TOKEN_START } from "~/utils";

/**
 * **RuntimeToken**`<[T]>`
 * 
 * A delimited runtime token which contains an interior string value
 * which _represents_ a type in the type system.
 */
export type RuntimeToken<T extends string = string> = `<<${typeof TOKEN_START}${T}${typeof TOKEN_END}>>`;


/**
 * **RuntimeTokenCallback**
 * 
 * A callback function which returns a `RuntimeToken` and
 * can be distinguished at runtime by the key value of 
 * `{ kind: "RuntimeToken" }`.
 */
export type RuntimeTokenCallback<T extends string = string> = 
    () => RuntimeToken<T>;
