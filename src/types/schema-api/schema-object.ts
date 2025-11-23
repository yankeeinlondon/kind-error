import type { FromInputToken__String, InputTokenSuggestions, Narrowable, ObjectKey } from "inferred-types";
import type { FromSchema, RecordKeySuggestions, SchemaCallback } from "~/types";

/**
 * the object based type definition of `SchemaApi`
 */
export interface SchemaApi__Object {
  /**
   * creates a map type by specifying the _key_ and _value_ properties as string tokens
   * representing the type desired
   */
  map: <
    K extends InputTokenSuggestions,
    V extends InputTokenSuggestions,
  >(key: K,
    value: V,
  ) => Map<FromInputToken__String<K>, FromInputToken__String<V>>;

  /**
   * define the type for a `Set<T>` type
   */
  set: <T extends InputTokenSuggestions>(value: T) => Set<FromInputToken__String<T>>;

  /**
   * define the type for an _optional_ `Set<T>` type
   */
  optSet: <T extends InputTokenSuggestions>(value: T) => Set<FromInputToken__String<T>> | undefined;

  /**
   * **record**`(key, value)`
   *
   * Define a record/dictionary by setting the key and value types.
   *
   * **Related:** `dictionary()`
   */
  record: <
    K extends RecordKeySuggestions,
    V extends InputTokenSuggestions,
  >(
    key: K,
    value: V,
  ) => FromInputToken__String<K> extends infer Key extends ObjectKey
    ? Record<
      Key,
      FromInputToken__String<V>
    >
    : Record<never, never>;

  /**
   * **optRecord**`(key, value) => Record | undefined`
   *
   * Define an _optional_ record/dictionary by setting the key and value types.
   *
   * **Related:** `dictionary()`
   */
  optRecord: <
    K extends RecordKeySuggestions,
    V extends InputTokenSuggestions,
  >(
    key: K,
    value: V,
  ) => FromInputToken__String<K> extends
  infer Key extends ObjectKey
    ? Record<
      Key,
      FromInputToken__String<V>
    > & undefined
    : undefined;

  /**
   * A _literal-like_ dictionary type where each key/value is typed independently
   * using callbacks.
   */
  dictionary: <
    const T extends Record<string, N[] | Record<string, N> | SchemaCallback>,
    N extends Narrowable,
  >(dict: T,
  ) => FromSchema<T>;

  /**
   * A _literal-like_ dictionary type in union with `undefined` where each key/value is
   * typed independently using callbacks.
   */
  optDictionary: <
    const T extends Record<string, N[] | Record<string, N> | SchemaCallback>,
    N extends Narrowable,
  >(dict: T,
  ) => FromSchema<T> | undefined;
}
