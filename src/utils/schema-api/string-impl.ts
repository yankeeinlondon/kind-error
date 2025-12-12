import type { Suggest } from "inferred-types";

import type { SchemaApi__String } from "~/types/schema-api";
import { asRuntimeTokenCallback, UNION_DELIMITER } from "../asRuntimeToken";

export const SCHEMA_API_STRING: SchemaApi__String = {
  string<T extends readonly string[]>(...literals: T) {
    return asRuntimeTokenCallback(
      literals.length === 0 ? "string" : `string::${literals.join(UNION_DELIMITER)}`,
    ) as unknown as [] extends T ? string : T[number];
  },

  optString<T extends readonly string[]>(...literals: T) {
    return asRuntimeTokenCallback(
      literals.length === 0
        ? "optString"
        : `optString::${[...literals, "undefined"].join(UNION_DELIMITER)}`,
    ) as unknown as [] extends T ? string | undefined : T[number] | undefined;
  },

  startsWith<T extends readonly string[]>(...literals: T) {
    return asRuntimeTokenCallback(
      `startsWith::${literals.join(UNION_DELIMITER)}`,
    ) as unknown as `${T[number]}${string}`;
  },

  endsWith<T extends readonly string[]>(...literals: T) {
    return asRuntimeTokenCallback(
      `endsWith::${literals.join(UNION_DELIMITER)}`,
    ) as unknown as `${string}${T[number]}`;
  },

  suggest<T extends readonly string[]>(...suggestions: T) {
    return asRuntimeTokenCallback(`suggest::${suggestions.join(UNION_DELIMITER)}>`) as unknown as [] extends T ? string : Suggest<T[number]>;
  },
} as const;
