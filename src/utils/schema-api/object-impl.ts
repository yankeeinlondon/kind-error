import type { FromInputToken__String, InputTokenSuggestions, Narrowable, ObjectKey } from "inferred-types";
import type {
  FromSchema,
  SchemaCallback,
} from "~/types";
import type { SchemaApi__Object } from "~/types/schema-api";
import { toJson } from "inferred-types";
import { asRuntimeTokenCallback } from "~/utils";
import { COMMA_DELIMITER } from "~/utils/schema";

export const SCHEMA_API_OBJECT: SchemaApi__Object = {

  map<K extends InputTokenSuggestions, V extends InputTokenSuggestions>(
    key: K,
    value: V,
  ): Map<FromInputToken__String<K>, FromInputToken__String<V>> {
    return asRuntimeTokenCallback(`map::${key}${COMMA_DELIMITER}${value}`) as unknown as Map<FromInputToken__String<K>, FromInputToken__String<V>>;
  },

  weakmap<K extends InputTokenSuggestions, V extends InputTokenSuggestions>(
    key: K,
    value: V,
  ): Map<FromInputToken__String<K>, FromInputToken__String<V>> {
    return asRuntimeTokenCallback(`map::${key}${COMMA_DELIMITER}${value}`) as unknown as Map<FromInputToken__String<K>, FromInputToken__String<V>>;
  },

  set<T extends InputTokenSuggestions>(val: T): Set<FromInputToken__String<T>> {
    return asRuntimeTokenCallback(`set::${val}`) as unknown as Set<FromInputToken__String<T>>;
  },

  optSet<T extends InputTokenSuggestions>(val: T): Set<FromInputToken__String<T>> {
    return asRuntimeTokenCallback(`optSet::${val}`) as unknown as Set<FromInputToken__String<T>>;
  },

  record<K extends string, V extends InputTokenSuggestions>(
    key: K,
    value: V,
  ) {
    return asRuntimeTokenCallback(`record::${key}${COMMA_DELIMITER}${value}`) as unknown as FromInputToken__String<K> extends infer Key extends ObjectKey
      ? Record<
        Key,
        FromInputToken__String<V>
      >
      : never;
  },

  optRecord<K extends string, V extends InputTokenSuggestions>(
    key: K,
    value: V,
  ) {
    return asRuntimeTokenCallback(`optRecord::${key}${COMMA_DELIMITER}${value}>`) as unknown as FromInputToken__String<K> extends infer Key extends ObjectKey
      ? Record<
        Key,
        FromInputToken__String<V>
      > & undefined
      : never;
  },

  dictionary<const T extends Record<string, N[] | Record<string, N> | SchemaCallback>, N extends Narrowable>(
    dict: T,
  ) {
    return asRuntimeTokenCallback(`dictionary::${toJson(dict)}`) as unknown as FromSchema<T>;
  },

  optDictionary<const T extends Record<string, N[] | Record<string, N> | SchemaCallback>, N extends Narrowable>(
    dict: T,
  ) {
    return asRuntimeTokenCallback(`optDictionary::${toJson(dict)}`) as unknown as FromSchema<T> | undefined;
  },
};
