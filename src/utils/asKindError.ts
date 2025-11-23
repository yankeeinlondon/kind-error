import type { Dictionary, ExpandRecursively, Mutable } from "inferred-types";
import type { KindError } from "~/types";
import { isNumber } from "inferred-types";
import { asError } from "./asError";
import { asKindSubType } from "./asKindSubtype";
import { asKindType } from "./asKindType";
import { getStackTrace } from "./getStackTrace";

export function asKindError<
  const T extends { kind: string; message: string; code?: number; [key: string]: unknown },
>(
  obj: T,
) {
  const err = asError(obj) as Dictionary & Error;
  err.__kind = "KindError";
  err.type = asKindType(obj.kind);
  err.subType = asKindSubType(obj.kind);

  err.stackTrace = getStackTrace();
  const leftover = obj as Dictionary;
  const context: Dictionary = {};

  for (const k of Object.keys(leftover)) {
    if (!["kind", "message", "stack", "name"].includes(k)) {
      context[k] = leftover[k];
      err[k] = leftover[k];
    }
  }
  if (isNumber(obj.code)) {
    context.code = obj.code;
    err.code = obj.code;
  }
  err.context = context;

  return err as unknown as KindError<T["kind"], T["message"], ExpandRecursively<Omit<Mutable<T>, "kind" | "message">>>;
}
