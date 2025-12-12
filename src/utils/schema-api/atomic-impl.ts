import type { SchemaApi__Atomic } from "~/types/schema-api";
import { asRuntimeTokenCallback } from "../asRuntimeToken";

export const SCHEMA_API_ATOMIC: SchemaApi__Atomic = {
  boolean() {
    return asRuntimeTokenCallback("boolean") as unknown as boolean;
  },
  true: () => asRuntimeTokenCallback("true") as unknown as true,
  false: () => asRuntimeTokenCallback("false") as unknown as false,
  null: () => asRuntimeTokenCallback("null") as unknown as null,
  undefined: () => asRuntimeTokenCallback("undefined") as unknown as undefined,
};
