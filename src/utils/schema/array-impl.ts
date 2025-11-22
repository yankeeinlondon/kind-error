import type { As, FromInputToken__Tuple, InputTokenSuggestions } from "inferred-types";
import type { SchemaApi__ArrayTuple } from "~/types";
import { asToken } from "../asToken";

/**
 * The **array** and **tuple** definition section of the `SchemaApi`
 */
export const SCHEMA_API_ARRAY_TUPLE: SchemaApi__ArrayTuple = {

  array<const T extends readonly InputTokenSuggestions[]>(...members: T) {
    return asToken(() => JSON.stringify(members)) as unknown as As<FromInputToken__Tuple<T>, readonly unknown[]>[number][];
  },

  optArray<const T extends readonly InputTokenSuggestions[]>(...members: T) {
    return asToken(() => JSON.stringify(members)) as unknown as T[number][] | undefined;
  },

  tuple<const T extends readonly InputTokenSuggestions[]>(...members: T): FromInputToken__Tuple<T> {
    return asToken(() => JSON.stringify(members)) as unknown as As<FromInputToken__Tuple<T>, readonly unknown[]>;
  },

  optTuple<const T extends readonly InputTokenSuggestions[]>(...members: T) {
    return asToken(() => JSON.stringify(members)) as unknown as As<FromInputToken__Tuple<T>, readonly unknown[]> | undefined;
  },
};
