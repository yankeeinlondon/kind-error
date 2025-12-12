import type { SchemaApi } from "~/types";
import { isDictionary } from "inferred-types";

export function isSchemaApi(val: unknown): val is SchemaApi {
  return isDictionary(val) && "kind" in val && val.kind === "KindApi";
}
