import type {
  EmptyObject,
  ExpandRecursively,
  FromInputToken,
  HasRequiredProps,
  InputToken,
  IsEqual,
  IsLiteralLike,
  IsUnion,
  IsWideObject,
  Not,
  StringKeys,
} from "inferred-types";
import type { SchemaCallback } from "./SchemaCallback";
import type { SchemaResult } from "./SchemaResult";
import type { DetectOptionalValues } from "./type-utils";

/**
 * **IsNonVariant**`<T>`
 *
 * Tests whether the type `T` is non-variant (aka, it can only have ONE value/type).
 */
export type IsNonVariant<T>
  = IsUnion<T> extends true
    ? false
    : T extends SchemaCallback
      ? IsNonVariant<SchemaResult<T>>
      : T extends InputToken
        ? FromInputToken<T> extends Error
        // do not treat as token
          ? IsLiteralLike<T> extends true
            ? IsUnion<T> extends true
              ? false
              : true
            : false
        // treat as token
          : FromInputToken<T> extends infer Token
            ? IsLiteralLike<Token> extends true
              ? IsUnion<Token> extends true
                ? false
                : true
              : false
            : false
      // not input token
        : IsLiteralLike<T> extends true
          ? IsUnion<T> extends true
            ? false
            : true
          : false;

/**
 * **IsVariant**`<T>`
 *
 * Tests whether the type `T` is variant type (aka, the type has more than one variant).
 */
export type IsVariant<T> = Not<IsNonVariant<T>>;

/**
 * tests whether the schema `T` has any literal values which are not variants,
 * in it's key/value definition.
 */
export type HasNonVariant<
  T extends Record<string, unknown>,
  K extends readonly (string & keyof T)[] = StringKeys<T>,
> = IsEqual<T, Record<string, unknown>> extends true
  ? true
  : IsEqual<T, EmptyObject> extends true
    ? false
    : K extends [
      infer Head extends string & keyof T,
      ...infer Rest extends readonly (string & keyof T)[],
    ]
      ? IsNonVariant<T[Head]> extends true
        ? true
        : HasNonVariant<T, Rest>
      : false;

/**
 * **Variants**`<T>`
 *
 * Reduces the `KindErrorType`'s context/schema to only key/values
 * which have _variant_ values/types.
 */
export type Variants<
  T extends Record<string, unknown>,
  K extends readonly (keyof T & string)[] = StringKeys<Required<T>>,
  R extends Record<string, unknown> = EmptyObject,
> = IsEqual<T, EmptyObject> extends true
  ? EmptyObject
  : IsEqual<T, Record<string, unknown>> extends true
    ? Record<string, unknown>
    : IsWideObject<T> extends true
      ? T
      : K extends [
        infer Head extends keyof T & string,
        ...infer Rest extends readonly (keyof T & string)[],
      ]
        ? T[Head] extends SchemaCallback
          ? IsNonVariant<SchemaResult<T[Head]>> extends true
            ? Variants<T, Rest, R>
            : Variants<T, Rest, R & Record<Head, SchemaResult<T[Head]>>>
          : T[Head] extends InputToken
            ? FromInputToken<T[Head]> extends Error
              ? IsNonVariant<T[Head]> extends true
                ? Variants<T, Rest, R>
                : Variants<T, Rest, R & Record<Head, T[Head]>>
              : IsNonVariant<FromInputToken<T[Head]>> extends true
                ? Variants<T, Rest, R>
                : Variants<T, Rest, R & Record<Head, FromInputToken<T[Head]>>>
            : IsNonVariant<T[Head]> extends true
              ? Variants<T, Rest, R>
              : Variants<T, Rest, R & Record<Head, T[Head]>>
        : ExpandRecursively<R>;

/**
 * **HasVariant**`<T>`
 *
 * Tests whether a `KindErrorType`'s has a optional or required "variant"
 * key/value as part of it's schema.
 */
export type HasVariant<
  T extends Record<string, unknown>,
  _K extends readonly (string & keyof T)[] = StringKeys<T>,
> = IsEqual<Variants<T>, EmptyObject> extends true
  ? false
  : true;

/**
 * **NonVariants**`<T>`
 *
 * When provided a `KindErrorType`'s context schema, it will return only the
 * key/values where the value is a _non-variant_ (aka, the type only allows a
 * single type/value).
 */
export type NonVariants<
  T extends Record<string, unknown>,
  K extends readonly (keyof T & string)[] = StringKeys<Required<T>>,
  R extends Record<string, unknown> = EmptyObject,
> = IsEqual<T, Record<string, unknown>> extends true
  ? EmptyObject
  : IsEqual<T, EmptyObject> extends true
    ? EmptyObject
    : K extends [
      infer Head extends keyof T & string,
      ...infer Rest extends readonly (keyof T & string)[],
    ]
      ? T[Head] extends SchemaCallback
        ? IsNonVariant<SchemaResult<T[Head]>> extends true
          ? NonVariants<T, Rest, R & Record<Head, SchemaResult<T[Head]>>>
          : NonVariants<T, Rest, R>
        : IsNonVariant<T[Head]> extends true
          ? NonVariants<T, Rest, R & Record<Head, T[Head]>>
          : NonVariants<T, Rest, R>
      : ExpandRecursively<R>;

/**
 * **RemoveVariants**`<T>`
 *
 * Type utility which takes a `KindErrorType`'s schema context and removes all key/values
 * which are not actually "default values" but instead represent a type variant.
 *
 * - This utility helps us to produce a valid key/value of static literals which were
 *   defined in the type and will be merged into the context properties defined in the
 *   instantiation of the `ErrorType`.
 * - Because we mutate the `KindErrorType`'s schema to represent something more meaningful
 *   to the caller in the type system (the _runtime_ still has token definitions) this utility
 *   will in effect remove all key/values which are typed as unions as these are all _variant_.
 */
export type RemoveVariants<
  T extends Record<string, unknown>,
  K extends readonly (string & keyof T)[] = StringKeys<T>,
  R extends Record<string, unknown> = EmptyObject,
> = IsEqual<T, EmptyObject> extends true
  ? EmptyObject
  : IsEqual<T, Record<string, unknown>> extends true
    ? EmptyObject
    : K extends [
      infer Head extends string & keyof T,
      ...infer Rest extends readonly (string & keyof T)[],
    ]
      ? T[Head] extends SchemaCallback
        ? IsNonVariant<SchemaResult<T[Head]>> extends true
          ? RemoveVariants<T, Rest, R & Record<Head, SchemaResult<T[Head]>>>
          : RemoveVariants<T, Rest, R>
        : IsUnion<T[Head]> extends true
          ? RemoveVariants<T, Rest, R>
          : RemoveVariants<T, Rest, R & Record<Head, T[Head]>>
      : ExpandRecursively<R>;

/**
 * Tests whether the context shape defined in the `KindErrorType` has
 * any **required** variant keys that must be defined when creating
 * the `KindError`.
 */
export type HasRequiredVariants<
  T extends Record<string, unknown>,
> = AsContextShape<T> extends infer Context extends Record<string, unknown>
  ? HasRequiredProps<Context>
  : never;

/**
 * **AsContextShape**`<TCtx>`
 *
 * Type utility which converts the KindErrorType's context definition
 * into the type the KindError's context property.
 *
 * - if `undefined` then there are no _variant_ properties for KindError to define
 * - otherwise the properties which are "variant" will be brought forward to the
 *   KindError but any union with `undefined` will be treated as an optional property
 */
export type AsContextShape<
  TSchema extends Record<string, unknown>,
> = DetectOptionalValues<
  Variants<TSchema>
>;
