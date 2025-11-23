import type {
  EmptyObject,
  ExpandRecursively,
  Scalar,
  StringKeys,
} from "inferred-types";

import type {
  SchemaCallback,
  SchemaDictionary,
  SchemaProperty,
  SchemaResult,
  SchemaTuple,
} from "~/types";

export type FromSchemaProperty<T extends SchemaProperty> = T extends Scalar
  ? T
  : T extends SchemaCallback
    ? SchemaResult<T>
    : never;

export type FromSchemaDictionary<
  T extends SchemaDictionary,
  K extends readonly (keyof T & string)[] = StringKeys<T>,
  R extends Record<string, unknown> = EmptyObject,
> = K extends [
  infer Head extends string & keyof T,
  ...infer Rest extends readonly (string & keyof T)[],
]
  ? T[Head] extends SchemaCallback
    ? FromSchemaDictionary<
      T,
      Rest,
            R & Record<Head, SchemaResult<T[Head]>>
    >
    : FromSchemaDictionary<
      T,
      Rest,
            R & Record<Head, T[Head]>
    >
  : ExpandRecursively<R>;

export type FromSchemaTuple<
  T extends SchemaTuple,
> = {
  [K in keyof T]: T[K] extends Scalar
    ? T[K]
    : T[K] extends SchemaCallback
      ? SchemaResult<T[K]>
      : never
};

/**
 * **FromSchema**`<T>`
 *
 * Converts a `SchemaProperty`, `SchemaDictionary`, or
 * `SchemaTuple` into the _type_ it represents.
 */
export type FromSchema<
  T extends SchemaProperty | SchemaDictionary | SchemaTuple,
> = T extends SchemaDictionary
  ? FromSchemaDictionary<T>
  : T extends SchemaTuple
    ? FromSchemaTuple<T>
    : T extends SchemaProperty
      ? FromSchemaProperty<T>
      : never;
