import type { AsKindSubType } from "~/types";
import { retainAfter } from "inferred-types";

export function asKindSubType<T extends string>(kind: T) {
  return (
    retainAfter(kind, "/") === ""
      ? undefined
      : String(kind.split("/").slice(1).join("/")).includes("|")
        ? String(kind.split("/").slice(1).join("/")).split("|").map(i => i.trim()).join(" | ")
        : String(kind.split("/").slice(1).join("/"))
  ) as AsKindSubType<T>;
}
