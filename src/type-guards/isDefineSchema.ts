import { isDictionary } from "inferred-types";
import { SchemaApi } from "~/types";

export function isDefineSchema(val: unknown): val is SchemaApi {
    return isDictionary(val) && "kind" in val && val.kind === "DefineSchema";
}
