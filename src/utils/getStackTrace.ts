import type { KindStackItem } from "~/types";
import { isString, Never } from "inferred-types";
import { toStackTrace } from "./toStackTrace";

export function getStackTrace(): KindStackItem[] {
  const { stack } = new Error("Stack Trace");

  return isString(stack)
    ? toStackTrace(stack)
    : Never;
}
