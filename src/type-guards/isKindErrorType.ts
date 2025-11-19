import type { KindErrorType } from "~/types";

export function isKindErrorType(val: unknown): val is KindErrorType {
  return typeof val === "function" && "__kind" in val && val.__kind === "KindErrorType";
}
