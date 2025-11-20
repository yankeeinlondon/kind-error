import { Container, EmptyObject, ExpandRecursively, FromInputToken__String, InputTokenSuggestions, IsUndefined, Narrowable, Scalar, shape, StringKeys, Suggest, TypedFunction } from "inferred-types";

// export type TranslateDictionary<
//     const T extends Record<string,unknown>,
//     K extends readonly (string & keyof T)[] = StringKeys<T>,
//     R extends Record<string, unknown> = EmptyObject
// > = K extends [
//     infer Head extends string & keyof T,
//     ...infer Rest extends readonly (string & keyof T)[]
// ]
//     ? T[Head] extends infer Value
//         ? Value extends SchemaCallback
//             ? 
//             : 
//         : never

// ;

// TODO
type TranslateDictionary<T> = unknown;



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

    boolean(): boolean;
    true(): true;
    false(): false;
    null(): null;
    undefined(): undefined;

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
     * **suggest**`(...suggestions)`
     * 
     * An array of of string-based suggestions. The type will "suggest" the suggestions but _any_ string
     * type will match the type.
     */
    suggest<T extends readonly string[]>(...literals: T): [] extends T ? string : Suggest<T[number]>;


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
     * creates a union type from the members listed
     */
    union<T extends readonly unknown[]>(...members: T): T[number];

    /**
     * creates a map type by specifying the _key_ and _value_ properties as string tokens
     * representing the type desired
     */
    map<
        K extends InputTokenSuggestions, 
        V extends InputTokenSuggestions
    >(key: K, value: V): Map<FromInputToken__String<K>, FromInputToken__String<V>>;

    set<V extends InputTokenSuggestions>(value: V): Set<FromInputToken__String<V>>;

    // /**
    //  * A literal-like dictionary type where each key/value is typed independently
    //  */
    // dictionary<const T extends Record<string,unknown>>(dict?: T): IsUndefined<T> extends true 
    //     ? Record<string,unknown>
    //     : TranslateDictionary<T>;

    // /**
    //  * An _optional_ literal-like dictionary type where each key/value is typed independently
    //  */
    // optDictionary<const T extends Record<string,unknown>>(dict?: T): IsUndefined<T> extends true 
    //     ? Record<string,unknown>
    //     : TranslateDictionary<T>;
    

    // /**
    //  * **array**`(...types)`
    //  * 
    //  * A wide array type where each element in the array represents an _allowed_ type in the
    //  * array. If not types are specified this will translate into `unknown[]`.
    //  */
    // array<const T extends readonly [Scalar | Object, ...readonly unknown[]]>(...members: T): T[number][];

    // tuple<const T extends readonly unknown[]>(...elements: T): T;


    // map<const K, const V>(key: K, value: V): Map<K,V>;
    // weakmap<const K extends Container, const V>(key: K, value: V): WeakMap<K,V>;
    // set<T extends readonly unknown[]>(types: T): Set<T[number]>;
}

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
