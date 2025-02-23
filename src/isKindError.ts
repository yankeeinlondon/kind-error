import type { Dictionary, Narrowable } from "inferred-types";
import type { KindError } from "./types";

export function isError(val: unknown): val is Error {
  return val instanceof Error;
}

type KindErrorOf<T> = T extends { kind: infer K; context: infer C }
  ? T & KindError<K & string, C & Dictionary<string, Narrowable>>
  : never;

/**
 * Type guard to detect whether `val` passed in is a `KindError`.
 */
export function isKindError<T>(
  val: T,
): val is KindErrorOf<T> {
  return isError(val) && "__kind" in val && val.__kind === "KindError" && "kind" in val;
}
