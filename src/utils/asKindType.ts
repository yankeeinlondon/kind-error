import type { AsKindType } from "~/types";
import { retainUntil } from "inferred-types";

/**
 * extracts the `type` from the `kind` property found
 */
export function asKindType<T extends string>(kind: T) {
  return retainUntil(kind, "/") as AsKindType<T>;
}
