import { retainUntil } from "inferred-types";
import { AsKindType } from "~/types";

/**
 * extracts the `type` from the `kind`
 */
export function asKindType<T extends string>(kind: T) {
    return retainUntil(kind, "/") as AsKindType<T>
}
