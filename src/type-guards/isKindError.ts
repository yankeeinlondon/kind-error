import type { Dictionary, IsEqual, Narrowable } from "inferred-types";
import type { KindError } from "src/types";
import {
  isString,

} from "inferred-types";
import { KindErrorSymbol } from "src/types";
import { isError } from "./isError";

type KindErrorOf<
  T,
  U extends string | undefined,
> = T extends { kind: infer K; context: infer C }
  ? U extends string
    ? IsEqual<U, K> extends true
      ? T & KindError<K & string, C & Dictionary<string, Narrowable>>
      : never
    : T & KindError<K & string, C & Dictionary<string, Narrowable>>
  : never;

/**
 * Type guard to detect whether `val` passed in is a `KindError`.
 */
export function isKindError<
  T,
  K extends string | undefined,
>(
  val: T,
  kind: K = undefined as K,
): val is KindErrorOf<T, K> {
  return isError(val)
    && KindErrorSymbol in val
    && val[KindErrorSymbol] === "KindError"
    && "kind" in val
    && isString(val.kind)
    && (
      kind === undefined
      || val.kind === kind
    );
}
