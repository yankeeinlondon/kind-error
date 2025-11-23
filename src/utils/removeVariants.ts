import type { NonVariants } from "~/types";
import { isVariant } from "./isVariant";

/**
 * **removeVariants**`(schema) -> Record<string,unknown>`
 *
 * Reduces the key/value pairs in the `KindErrorType`'s context schema
 * to only those key/values which are static/literal key/values and **not**
 * where the value is _type reference_.
 */
export function removeVariants<T extends Record<string, unknown>>(schema: T): NonVariants<T> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(schema)) {
    if (!isVariant(val)) {
      result[key] = val;
    }
  }

  return result as NonVariants<T>;
}
