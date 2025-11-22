import type { SchemaApi } from "~/types";
import { isDictionary } from "inferred-types";

/**
 * **isSchemaDictionary**`(val)`
 * 
 * Checks whether a `val` is a `SchemaDictionary`:
 * 
 * - a schema dictionary is a key/value type but the values
 *   can be either:
 *     - a raw **scalar** value, or 
 *     - a `SchemaCallback` function.
 */
export function isSchemaDictionary(val: unknown): val is SchemaApi {
  return isDictionary(val) && "kind" in val && val.kind === "DefineSchema";
}
