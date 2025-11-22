import type { SchemaApi__Atomic } from "~/types";
import { asToken } from "../asToken";

export const SCHEMA_API_ATOMIC: SchemaApi__Atomic = {
  boolean() {
    return asToken(() => "boolean") as unknown as boolean;
  },
  true: () => asToken(() => "true") as unknown as true,
  false: () => asToken(() => "false") as unknown as false,
  null: () => asToken(() => "null") as unknown as null,
  undefined: () => asToken(() => "undefined") as unknown as undefined,
};
