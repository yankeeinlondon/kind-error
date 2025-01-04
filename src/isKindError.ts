import type { KindError } from "./types";
import { isObject } from "inferred-types";

export function isError(val: unknown): val is Error {
  return isObject(val);
}

type KindErrorOf<T> = T extends { kind: infer K; context: infer C }
  ? T & KindError<K, C>
  : never;

/**
 * Type guard to detect whether `val` passed in is a `KindError`.
 */
export function isKindError<T>(val: T): val is KindErrorOf<T> {
  return isError(val) && "__kind" in val && val.__kind === "KindError";
}
