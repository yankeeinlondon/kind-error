import type { AsKindSubType } from "~/types";
import { retainAfter } from "inferred-types";

export function asKindSubType<T extends string>(kind: T) {
  return (
    retainAfter(kind, "/") === ""
      ? undefined
      : kind.split("/").slice(1).join("/").includes("|")
        ? kind.split("/").slice(1).join("/").split("|").map(i => i.trim()).join(" | ")
        : kind.split("/").slice(1).join("/")
  ) as AsKindSubType<T>;
}
