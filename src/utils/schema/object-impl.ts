import type { FromInputToken__String, InputTokenSuggestions, Narrowable } from "inferred-types";
import type { ObjectKey } from "inferred-types/types";
import type {
  FromSchema,
  RecordKeySuggestions,
  SchemaApi__Object,
  SchemaCallback,
} from "~/types";
import { toJson } from "inferred-types";
import { asToken } from "../asToken";

export const SCHEMA_API_OBJECT: SchemaApi__Object = {

  map<K extends InputTokenSuggestions, V extends InputTokenSuggestions>(
    key: K,
    value: V,
  ): Map<FromInputToken__String<K>, FromInputToken__String<V>> {
    return asToken(() => `Map<${key}, ${value}>`) as unknown as Map<FromInputToken__String<K>, FromInputToken__String<V>>;
  },

  set<T extends InputTokenSuggestions>(val: T): Set<FromInputToken__String<T>> {
    return asToken(() => `Set<${val}>`) as unknown as Set<FromInputToken__String<T>>;
  },

  optSet<T extends InputTokenSuggestions>(val: T): Set<FromInputToken__String<T>> {
    return asToken(() => `Set<${val}> | undefined`) as unknown as Set<FromInputToken__String<T>>;
  },

  record<K extends RecordKeySuggestions, V extends InputTokenSuggestions>(
    key: K,
    value: V,
  ) {
    return asToken(() => `Record<${key}, ${value}>`) as unknown as FromInputToken__String<K> extends infer Key extends ObjectKey
      ? Record<
        Key,
        FromInputToken__String<V>
      >
      : never;
  },

  optRecord<K extends RecordKeySuggestions, V extends InputTokenSuggestions>(
    key: K,
    value: V,
  ) {
    return asToken(() => `Record<${key}, ${value}>`) as unknown as FromInputToken__String<K> extends infer Key extends ObjectKey
      ? Record<
        Key,
        FromInputToken__String<V>
      > & undefined
      : never;
  },

  dictionary<const T extends Record<string, N[] | Record<string, N> | SchemaCallback>, N extends Narrowable>(
    dict: T,
  ) {
    return asToken(() => toJson(dict)) as unknown as FromSchema<T>;
  },

  optDictionary<const T extends Record<string, N[] | Record<string, N> | SchemaCallback>, N extends Narrowable>(
    dict: T,
  ) {
    return asToken(() => toJson(dict)) as unknown as FromSchema<T> | undefined;
  },
};
