import type { SchemaApi__Numeric } from "~/types";
import { asToken } from "../asToken";

export const SCHEMA_API_NUMERIC: SchemaApi__Numeric = {
  number<T extends readonly number[]>(...literals: T) {
    return asToken(
        () => literals.length === 0 ? "number" : literals.join(" | ")
    ) as unknown as [] extends T ? number : T[number];
  },

  optNumber<T extends readonly number[]>(...literals: T) {
    return asToken(() => literals.length === 0 ? "number | undefined" : `${literals.join(" | ")} | undefined`) as unknown as [] extends T ? number | undefined : T[number] | undefined;
  },
  bigInt() {
    return asToken(() => "BigInt") as unknown as bigint;
  },
  optBigInt() {
    return asToken(() => "BigInt | undefined") as unknown as bigint | undefined;
  },
};
