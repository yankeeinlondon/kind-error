import type {
  Dictionary,
  Scalar,
} from "inferred-types";
import type {
  DetectOptionalValues,
  FromSchema,
  FromSchemaTuple,
  SchemaApi,
  SchemaCallback,
  SchemaResult,
} from "~/types";
import {
  isFunction,
  isScalar,
  Never,
} from "inferred-types";
import { isSchemaDictionary } from "~/type-guards";
import {
  asRuntimeTokenCallback,
  COMMA_DELIMITER,
  TOKEN_END,
  TOKEN_START,
  UNION_DELIMITER,
} from "./asRuntimeToken";
import {
  SCHEMA_API_ARRAY_TUPLE,
  SCHEMA_API_ATOMIC,
  SCHEMA_API_DOMAIN,
  SCHEMA_API_NUMERIC,
  SCHEMA_API_OBJECT,
  SCHEMA_API_STRING,
  setSchemaApi,
} from "./schema-api";

export {
  COMMA_DELIMITER,
  TOKEN_END,
  TOKEN_START,
  UNION_DELIMITER,
};

export const SCHEMA_API = {
  kind: "SchemaApi",

  ...SCHEMA_API_STRING,
  ...SCHEMA_API_NUMERIC,
  ...SCHEMA_API_ARRAY_TUPLE,
  ...SCHEMA_API_OBJECT,
  ...SCHEMA_API_ATOMIC,
  ...SCHEMA_API_DOMAIN,

  union<const T extends readonly unknown[]>(...members: T): T[number] {
    return asRuntimeTokenCallback(`union::${members.join(UNION_DELIMITER)}`) as unknown as T[number];
  },
} as SchemaApi;

/**
 * **schemaProp**`(cb) => type`
 *
 * Defines a _type_ for property in a schema.
 */
export function schemaProp<T extends SchemaCallback | Scalar>(cb: T): T extends SchemaCallback ? SchemaResult<T> : T {
  const resolved = isScalar(cb)
    ? cb
    : isFunction(cb)
      ? cb(SCHEMA_API)
      : Never;
  return asRuntimeTokenCallback(
    isFunction(resolved)
      ? resolved()
      : isSchemaDictionary(resolved)
        ? Never
        : resolved,
  ) as T extends SchemaCallback ? SchemaResult<T> : T;
}

/**
 * **schemaTuple**`(...elements)`
 *
 * Creates `RuntimeToken`s for runtime values while converting to the
 * tuple type that these tokens are meant to represent.
 */
export function schemaTuple<const T extends readonly (Scalar | SchemaCallback)[]>(...elements: T) {
  const tokens = elements.map((t) => {
    const val = isScalar(t)
      ? t
      : isFunction(t)
        ? t(SCHEMA_API)
        : Never;
    return isFunction(val) ? val() : val;
  });

  return asRuntimeTokenCallback(
    `tuple::${tokens.join(COMMA_DELIMITER)}`,
  ) as unknown as FromSchemaTuple<[...T]>;
}

/**
 * **schemaObject**`(defn)`
 *
 * Creates an object with resolved types.
 */
export function schemaObject<const T extends Record<string, Scalar | SchemaCallback>>(defn: T) {
  const output: Dictionary = {};

  for (const k of Object.keys(defn)) {
    const val = isFunction(defn[k])
      ? defn[k](SCHEMA_API)
      : defn[k];
    output[k] = isFunction(val) ? val() : val;
  }

  return asRuntimeTokenCallback(`dictionary::${JSON.stringify(output)}`) as unknown as DetectOptionalValues<FromSchema<T>>;
}

setSchemaApi(SCHEMA_API);
