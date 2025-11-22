import { isDictionary } from "inferred-types";
import { SchemaApi } from "~";

export function isSchemaApi(val: unknown): val is SchemaApi {
    return isDictionary(val) && "kind" in val && val.kind === 
}
