import { 
    EmptyObject, 
    ExpandRecursively, 
    FromInputToken__String, 
    FromInputToken__Tuple, 
    InputTokenSuggestions, 
    Narrowable, 
    ObjectKey, 
    Scalar, 
    StringKeys, 
    Suggest, 
    TypedFunction 
} from "inferred-types";
import { Email, EmailDomain } from "./Domains";



/**
 * Helper type to distribute template literal type over union members for startsWith.
 * This prevents "union type too complex" errors by forcing TypeScript to distribute
 * the operation across each union member individually rather than computing all
 * combinations upfront.
 */
type StartsWithDistribute<T> = T extends string ? `${T}${string}` : never;

/**
 * Helper type to distribute template literal type over union members for endsWith.
 * This prevents "union type too complex" errors by forcing TypeScript to distribute
 * the operation across each union member individually rather than computing all
 * combinations upfront.
 */
type EndsWithDistribute<T> = T extends string ? `${string}${T}` : never;

/**
 * the string-based type definition of `SchemaApi`
 */
export type SchemaApi__String = {

    /**
     * **string**`(...literals)`
     *
     * a wide string (with no params), a string literal (with one param), or a string literal union
     * (with multiple params).
     */
    string<T extends readonly string[]>(...literals: T): [] extends T ? string : T[number];

    /**
     * **optString**`(...literals)`
     *
     * an _optional_ wide string (with no params), an _optional_ string literal (with one param),
     * or an _optional_ string literal union (with multiple params).
     */
    optString<T extends readonly string[]>(...literals: T): [] extends T ? string | undefined : T[number] | undefined;


    /**
     * **startsWith**`<T>(...literals: T) => StartsWithDistribute<T[number]>`
     *
     * defines a string literal which is defined to _start with_ any of the literals
     * you pass in.
     */
    startsWith<T extends readonly string[]>(...literals: T): StartsWithDistribute<T[number]>;

    /**
     * **endsWith**`<T>(...literals: T) => EndsWithDistribute<T[number]>`
     *
     * defines a string literal which is defined to _end with_ any of the literals
     * you pass in.
     */
    endsWith<T extends readonly string[]>(...literals: T): EndsWithDistribute<T[number]>;


    /**
     * **suggest**`(...suggestions)`
     * 
     * An array of of string-based suggestions. The type will "suggest" the suggestions but _any_ string
     * type will match the type.
     */
    suggest<T extends readonly string[]>(...literals: T): [] extends T ? string : Suggest<T[number]>;
}

/**
 * the numeric-based type definition of `SchemaApi`
 */
export type SchemaApi__Numeric = {

    /**
     * a wide number (with no params), a numeric literal (with one param), or a
     * numeric literal union (with multiple params).
     */
    number<T extends readonly number[]>(...literals: T): [] extends T ? number : T[number];

    /**
     * an _optional_ wide number (with no params), an _optional_ numeric literal (with one param), 
     * or an _optional_ numeric literal union (with multiple params).
     */
    optNumber<T extends readonly number[]>(...literals: T): [] extends T ? number | undefined : T[number] | undefined;

    /**
     * Make type a `BigInt`
     */
    bigInt(): BigInt;

    /**
     * Make type an _optional_ `BigInt`
     */
    optBigInt(): BigInt | undefined;
}

/**
 * the array and tuple type definition of `SchemaApi`
 */
export type SchemaApi__ArrayTuple = {

    /**
     * **array**`(...types)`
     * 
     * A wide array type where each element in the array represents an _allowed_ type in the
     * array. If not types are specified this will translate into `unknown[]`.
     */
    array<const T extends readonly InputTokenSuggestions[]>(...members: T): FromInputToken__Tuple<T>[number][];

    /**
     * **optArray**`(...types)`
     * 
     * A wide array type where each element in the array represents an _allowed_ type in the
     * array. If not types are specified this will translate into `unknown[]`.
     */
    optArray<const T extends readonly InputTokenSuggestions[]>(...members: T): T[number][] | undefined;

    /**
     * **tuple**`(...elements)`
     * 
     * Treats each element as a "token" for an element in the tuple.
     */
    tuple<T extends readonly InputTokenSuggestions[]>(...elements: T): FromInputToken__Tuple<T>;

    /**
     * **optTuple**`(...elements)`
     * 
     * Treats each element as a "token" for an element in the tuple; converts into an
     * _optional_ tuple (e.g., `FromInputToken<T> | undefined`)
     */
    optTuple<const T extends readonly InputTokenSuggestions[]>(...elements: T): FromInputToken__Tuple<T> | undefined;
}


/**
 * the object based type definition of `SchemaApi`
 */
export type SchemaApi__Object = {
    /**
     * creates a map type by specifying the _key_ and _value_ properties as string tokens
     * representing the type desired
     */
    map<
        K extends InputTokenSuggestions, 
        V extends InputTokenSuggestions
    >(key: K, value: V): Map<FromInputToken__String<K>, FromInputToken__String<V>>;

    /**
     * define the type for a `Set<T>` type
     */
    set<T extends InputTokenSuggestions>(value: T): Set<FromInputToken__String<T>>;

    /**
     * define the type for an _optional_ `Set<T>` type
     */
    optSet<T extends InputTokenSuggestions>(value: T): Set<FromInputToken__String<T>> | undefined;

    /**
     * **record**`(key, value)`
     * 
     * Define a record/dictionary by setting the key and value types.
     * 
     * **Related:** `dictionary()`
     */
    record<
        K extends RecordKeySuggestions, 
        V extends InputTokenSuggestions
    >(
        key: K, 
        value: V
    ): FromInputToken__String<K> extends infer Key extends ObjectKey
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
    optRecord<
        K extends RecordKeySuggestions, 
        V extends InputTokenSuggestions
    >(
        key: K, 
        value: V
    ): FromInputToken__String<K> extends infer Key extends ObjectKey
        ? Record<
            Key,
            FromInputToken__String<V>
        > & undefined
        : undefined;

    /**
     * A _literal-like_ dictionary type where each key/value is typed independently
     * using callbacks.
     */
    dictionary<
        const T extends Record<string, N[] | Record<string,N> | SchemaCallback>, 
        N extends Narrowable
    >(dict: T): FromSchema<T>;

    /**
     * A _literal-like_ dictionary type in union with `undefined` where each key/value is 
     * typed independently using callbacks.
     */
    optDictionary<
        const T extends Record<string, N[] | Record<string,N> | SchemaCallback>, 
        N extends Narrowable
    >(dict: T): FromSchema<T> | undefined;
}

export type SchemaApi__Atomic = {
    /** set the type to the wide `boolean` type */
    boolean(): boolean;
    /** set the type to `true` */
    true(): true;
    /** set the type to `false` */
    false(): false;
    /** set the type to `null` */
    null(): null;
    /** set the type to `undefined` */
    undefined(): undefined;
}

export type SchemaApi__Domain = {
    email<const T extends readonly EmailDomain[]>(
        ...constraints: T
    ): [] extends T ? Email : Email<T>;
}

/**
 * **SchemaApi**
 *
 * The API surface used to define types.
 *
 * - all functions allow for no parameters but many offer variant configuration
 *   but passing in parameters too.
 */
export type SchemaApi = {
    kind: "SchemaApi";

    /**
     * creates a union type from the members listed
     */
    union<const T extends readonly unknown[]>(...members: T): T[number];

} 
    & SchemaApi__Atomic 
    & SchemaApi__String 
    & SchemaApi__Numeric 
    & SchemaApi__ArrayTuple 
    & SchemaApi__Object;

/**
 * **SchemaCallback**
 * 
 * A callback which is provided the `SchemaApi` in order to define
 * the _type_ of a given schema element for the `KindErrorType`'s 
 * context schema.
 * 
 * - if a `SchemaCallback` returns _itself_ this will be treated as the _never_ type
 * - if a function is returned then the return type of the function with no parameters
 *   passed in will be returned.
 *
 * The callback receives the `SchemaApi` instance so callers can infer return types from
 * the API surface.
 */
export type SchemaCallback<TReturn = unknown> = (api: SchemaApi) => TReturn;


export type SchemaResult<T extends SchemaCallback> = ReturnType<T> extends TypedFunction
    ? ReturnType<ReturnType<T>>
    : ReturnType<T> extends SchemaApi
        ? never
        : ReturnType<T>;

/**
 * **ContextSchema**
 * 
 * A `ContextSchema` is a dictionary of key/value pairs. The _values_ can
 * consist of a literal type or a `SchemaCallback` to define the type through
 * the `SchemaApi`.
 * 
 * **Related:** `FromSchema`
 */
export type ContextSchema<N extends Narrowable = Narrowable> = Record<
    string,
    Scalar | N[] | Record<string,N> | SchemaCallback
>; 


/**
 * **FromSchema**`<T>`
 * 
 * Takes a `ContextSchema` as input and ensures that all `SchemaCallback`'s 
 * are processed to leave only a non-callback based type to represent the 
 * each schema properties _type_.
 */
export type FromSchema<
    T extends ContextSchema,
    K extends readonly (string & keyof T)[] = StringKeys<T>,
    R extends Record<string, unknown> = EmptyObject
> = K extends [
    infer Head extends string & keyof T,
    ...infer Rest extends readonly (string & keyof T)[]
]
    ? T[Head] extends SchemaCallback
        ? FromSchema<
            T,
            Rest,
            R & Record<Head, SchemaResult<T[Head]>>
        >
        : FromSchema<
            T,
            Rest,
            R & Record<Head, T[Head]>
        >
: ExpandRecursively<R>;


export type TupleDefn = readonly (Scalar | SchemaCallback)[];

export type FromSchemaTuple<
    T extends readonly (Scalar | SchemaCallback)[]
> = {
    [K in keyof T]: T[K] extends SchemaCallback
        ? SchemaResult<T[K]>
        : T[K]
};

/**
 * **SchemaToken**
 * 
 * Any runtime value which is used to _represent_ a type.
 * 
 * - all tokens will have be literal translated into type except for a
 *   `SchemaCallback` function which is used to define types separate from
 *   runtime value.
 * - For example:
 *     - `abc` is a token which represents the string literal `abc`
 *     - `42` is a token which represents the numeric literal `42`
 *     - `<T extends SchemaApi>(api: T) => api.string()` represents the 
 *        wide "string" type.
 *     - `<T extends SchemaApi>(api: T) => api.string("foo","bar")` represents the 
 *        union of the "foo" and "bar" literal strings.
 */
export type SchemaToken = 
    | SchemaCallback
    | Record<string, SchemaCallback>
    | readonly SchemaToken[]
    | Narrowable; // to be treated one-for-one as their runtime value/type


/**
 * An identity function which returns a string InputToken for the type it's
 * representing. The function must also have a key of `kind` which equals
 * "RuntimeToken".
 * 
 * **Related:** `asToken()`, `isRuntimeToken()`
 */
export type RuntimeToken<T = unknown> = () => T & { kind: "RuntimeToken" };


export type RecordKeySuggestions = Suggest<
| `"foo" | "bar"`
| `"_{{String}}"`
| `"{{String}}_"`
| "string"
>
