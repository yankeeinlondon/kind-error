import type { AsKindSubType } from "~/types";
import { retainAfter } from "inferred-types";

export function asKindSubType<T extends string>(kind: T) {
  return (
    retainAfter(kind, "/") === ""
      ? undefined
      : String(retainAfter(kind, "/")).includes("|")
        ? String(retainAfter(kind, "/")).split("|").map(i => i.trim()).join(" | ")
        : String(retainAfter(kind, "/"))
  ) as AsKindSubType<T>;
}
