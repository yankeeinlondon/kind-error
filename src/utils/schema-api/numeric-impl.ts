import type { SchemaApi__Numeric } from "~/types/schema-api";
import { asRuntimeTokenCallback, UNION_DELIMITER } from "../asRuntimeToken";

export const SCHEMA_API_NUMERIC: SchemaApi__Numeric = {
  number<T extends readonly number[]>(...literals: T) {
    return asRuntimeTokenCallback(
      literals.length === 0 ? "number" : `number::${literals.join(UNION_DELIMITER)}`,
    ) as unknown as [] extends T ? number : T[number];
  },

  optNumber<T extends readonly number[]>(...literals: T) {
    return asRuntimeTokenCallback(literals.length === 0 ? "optNumber" : `optNumber::${[...literals, "undefined"].join(UNION_DELIMITER)}`) as unknown as [] extends T ? number | undefined : T[number] | undefined;
  },
  bigInt() {
    return asRuntimeTokenCallback("bigint") as unknown as bigint;
  },
  optBigInt() {
    return asRuntimeTokenCallback("optBigint") as unknown as bigint | undefined;
  },
};
