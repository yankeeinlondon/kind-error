import type {
  As,
  EmptyObject,
  ExpandRecursively,
  FromInputToken,
  InputToken,
  KebabCase,
  MakeKeysOptional,
  PascalCase,
  RetainAfter,
  RetainUntil,
  Split,
  StringKeys,
  StripChars,
  TrimEach,
  UnionExtends,
} from "inferred-types";

/**
 * Type utility which converts a string literal to a valid
 * `kind` property.
 */
export type PascalKind<T extends string> = string extends T
  ? string
  : PascalCase<
    StripChars<T, "<" | ">" | "[" | "]" | "(" | ")">
  >;

/**
 * Type utility which converts an array of strings into valid
 * values for the `kind` property.
 */
export type PascalName<
  T extends readonly string[],
> = {
  [K in keyof T]: PascalKind<T[K]>
};

/**
 * Type utility which converts a string literal into a
 * valid `kind` property.
 */
export type KebabKind<T extends string> = KebabCase<
  StripChars<T, "<" | ">" | "[" | "]" | "(" | ")">
>;

/**
 * converts the kind **name** into the **type** properties string literal
 */
export type AsKindType<T extends string> = string extends T
  ? string
  : RetainUntil<T, "/">;

type PrepUnion<
  T extends string,
> = TrimEach<Split<T, "|">>[number];

/**
 * converts the kind **name** into the **subType** property's string literal
 * value (or _undefined_ if no `/` character found in the )
 */
export type AsKindSubType<T extends string> = As<
  string extends T
    ? string | undefined
    : RetainAfter<T, "/"> extends infer SubType extends string
      ? SubType extends ""
        ? undefined
        : SubType extends `${string}|${string}`
          ? PrepUnion<SubType>
          : SubType
      : never,
    string | undefined
>;

/**
 * **DetectOptionalValues**`<T>`
 *
 * Looks for values in the dictionary which are a union with `undefined`
 * and makes these key/values optional.
 */
export type DetectOptionalValues<
  T extends Record<string, unknown>,
  K extends readonly (keyof T & string)[] = StringKeys<T>,
  R extends readonly string[] = [],
> = K extends [
  infer Head extends string & keyof T,
  ...infer Rest extends readonly (string & keyof T)[],
]
  ? UnionExtends<T[Head], undefined> extends true
    ? DetectOptionalValues<T, Rest, [...R, Head]>
    : DetectOptionalValues<T, Rest, R>
  : MakeKeysOptional<T, R>;

/**
 * Converts any `InputToken` values found in the `KindErrorType`'s
 * context object into the type that the token represents. All other
 * values are left as is.
 */
export type ParseContext<
  T extends Record<string, unknown>,
  K extends readonly (string & keyof T)[] = StringKeys<T>,
  R extends Record<string, unknown> = EmptyObject,
> = K extends [
  infer Head extends string & keyof T,
  ...infer Rest extends readonly (string & keyof T)[],
]
  ? T[Head] extends InputToken
    ? FromInputToken<T[Head]> extends Error
      ? ParseContext<T, Rest, R & Record<Head, T[Head]>>
      : ParseContext<T, Rest, R & Record<Head, FromInputToken<T[Head]>>>
    : ParseContext<T, Rest, R & Record<Head, T[Head]>>
  : ExpandRecursively<R>;
