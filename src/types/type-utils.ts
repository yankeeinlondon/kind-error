import { 
    As,
    Contains, 
    Dictionary, 
    EmptyObject, 
    ExpandRecursively, 
    FromInputToken, 
    HasRequiredProps, 
    InputToken, 
    IsEqual, 
    IsLiteralLike, 
    IsUnion, 
    IsWideObject, 
    KebabCase, 
    MakeKeysOptional, 
    PascalCase, 
    RetainAfter, 
    RetainUntil, 
    Split, 
    StringKeys, 
    StripChars, 
    TrimEach, 
    UnionExtends 
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
: RetainUntil<T,"/">;

type PrepUnion<
    T extends string
> = TrimEach<Split<T, "|">>[number]

/**
 * converts the kind **name** into the **subType** property's string literal
 * value (or _undefined_ if no `/` character found in the )
 */
export type AsKindSubType<T extends string> = As<
    string extends T
    ? string | undefined
    : RetainAfter<T,"/"> extends infer SubType extends string
        ? SubType extends ""
            ? undefined
        : Contains<SubType, "|"> extends true
            ? PrepUnion<SubType>
            : SubType
    : never,
    string | undefined        
>;

/**
 * **IsNonVariant**`<T>`
 * 
 * Tests whether the type `T` is non-variant (aka, it can only have ONE value/type).
 */
export type IsNonVariant<T> = 
IsUnion<T> extends true
    ? false
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
            : true
        :false
// not input token
: IsLiteralLike<T> extends true
            ? IsUnion<T> extends true
                ? false
                    : true
        : false;


/**
 * tests whether the schema `T` has any literal values which are not variants,
 * in it's key/value definition.
 */
export type HasNonVariant<
    T extends Dictionary<string>,
    K extends readonly (string & keyof T)[] = StringKeys<T>
> = [Dictionary<string>] extends [T]
? false
: IsEqual<T, EmptyObject> extends true
? false
: K extends [
    infer Head extends string & keyof T,
    ...infer Rest extends readonly (string & keyof T)[]
]
    ? IsNonVariant<T[Head]> extends true
        ? true
        : HasNonVariant<T,Rest>
: false;


export type NonVariants<
    T extends Dictionary<string>,
    K extends readonly (keyof T & string)[] = StringKeys<T>,
    R extends Dictionary<string> = EmptyObject
> = IsEqual<T, Dictionary<string>> extends true
? EmptyObject
: IsEqual<T, EmptyObject> extends true
? EmptyObject
: K extends [
    infer Head extends keyof T & string,
    ...infer Rest extends readonly (keyof T & string)[]
]
    ? IsNonVariant<T[Head]> extends true
        ? NonVariants<T,Rest,R & Record<Head, T[Head]>>
        : NonVariants<T,Rest,R>
: ExpandRecursively<R>
;


/**
 * strips all non-variant key/value pairs from the KindErrorType's context.
 */
export type StripNonVariantValues<
    T extends Dictionary<string>,
    K extends readonly (keyof T & string)[] = StringKeys<T>,
    R extends Dictionary<string> = EmptyObject
> = IsWideObject<T> extends true
? T
: K extends [
    infer Head extends keyof T & string,
    ...infer Rest extends readonly (keyof T & string)[]
]
    ? T[Head] extends InputToken
        ? FromInputToken<T[Head]> extends Error
            ? IsNonVariant<T[Head]> extends true
                ? StripNonVariantValues<T,Rest,R>
                : StripNonVariantValues<T,Rest,R & Record<Head, T[Head]>>
            : IsNonVariant<FromInputToken<T[Head]>> extends true
                ? StripNonVariantValues<T,Rest,R>
                : StripNonVariantValues<T,Rest,R & Record<Head, FromInputToken<T[Head]>>>
    : IsNonVariant<T[Head]> extends true
        ? StripNonVariantValues<T,Rest,R>
        : StripNonVariantValues<T,Rest,R & Record<Head, T[Head]>>
: ExpandRecursively<R>;


export type IsOptional<T> = IsUnion<T> extends true
    ? undefined extends T
        ? true
        : false
    : false;

/**
 * **DetectOptionalValues**`<T>`
 * 
 * Looks for values in the dictionary which are a union with `undefined`
 * and makes these key/values optional.
 */
export type DetectOptionalValues<
    T extends Dictionary<string>,
    K extends readonly (keyof T & string)[] = StringKeys<T>,
    R extends readonly string[] = []
> = K extends [
    infer Head extends string & keyof T,
    ...infer Rest extends readonly (string & keyof T)[]
]
    ? UnionExtends<T[Head], undefined> extends true
        ? DetectOptionalValues<T,Rest,[...R, Head]>
        : DetectOptionalValues<T,Rest,R>
: MakeKeysOptional<T,R>;

/**
 * Converts any `InputToken` values found in the `KindErrorType`'s 
 * context object into the type that the token represents. All other
 * values are left as is.
 */
export type ParseContext<
    T extends Dictionary<string>,
    K extends readonly (string & keyof T)[] = StringKeys<T>,
    R extends Dictionary<string> = EmptyObject
> = K extends [
    infer Head extends string & keyof T,
    ...infer Rest extends readonly (string & keyof T)[]
]
    ? T[Head] extends InputToken
        ? FromInputToken<T[Head]> extends Error
            ? ParseContext<T, Rest, R & Record<Head, T[Head]>>
            : ParseContext<T, Rest, R & Record<Head, FromInputToken<T[Head]>>>
    : ParseContext<T, Rest, R & Record<Head, T[Head]>>
: ExpandRecursively<R>;

;

/** 
 * Tests whether the context shape defined in the `KindErrorType` has
 * any **required** variant keys that must be defined when creating 
 * the `KindError`.
 */
export type HasRequiredVariants<
    T extends Dictionary<string>
> = AsContext<T> extends infer Context extends Dictionary<string>
    ? HasRequiredProps<Context>
    : never;



/**
 * **AsContext**`<TCtx>`
 * 
 * Type utility which converts the KindErrorType's context definition
 * into the type the KindError's context property.
 * 
 * - if `undefined` then there are no _variant_ properties for KindError to define
 * - otherwise the properties which are "variant" will be brought forward to the 
 *   KindError but any union with `undefined` will be treated as an optional property
 */
export type AsContext<
    TCtx extends Dictionary<string>
> = DetectOptionalValues<
    StripNonVariantValues<TCtx>
>;

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
    T extends Dictionary<string>,
    K extends readonly (string & keyof T)[] = StringKeys<T>,
    R extends Dictionary<string> = EmptyObject
> = IsEqual<T,EmptyObject> extends true
? EmptyObject
: IsEqual<T, Dictionary<string>> extends true
? EmptyObject
: K extends [
    infer Head extends string & keyof T,
    ...infer Rest extends readonly (string & keyof T)[]
]
    ? IsUnion<T[Head]> extends true
        ? RemoveVariants<T,Rest,R>
        : RemoveVariants<T,Rest,R & Record<Head, T[Head]>>
: ExpandRecursively<R>
;
