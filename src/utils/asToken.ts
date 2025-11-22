import { createFnWithProps } from "inferred-types";

/**
 * **asToken**`(fn)`
 *
 * Adds the KV `{ kind: "RuntimeToken" }` to the passed in function to make it a
 * `RuntimeToken` type.
 */
export function asToken<T extends () => unknown>(fn: T) {
  return createFnWithProps(fn, { kind: "RuntimeToken" }) as T & { kind: "RuntimeToken" };
}
