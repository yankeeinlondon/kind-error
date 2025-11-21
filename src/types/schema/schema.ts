import { 
    EmptyObject, 
    ExpandRecursively, 
    Narrowable, 
    Scalar, 
    StringKeys, 
    Suggest, 
    TypedFunction 
} from "inferred-types";

import { SchemaApi__Object } from "./schema-object";
import { SchemaApi__Atomic } from "./schema-atomic";
import { SchemaApi__ArrayTuple } from "./schema-array";
import { SchemaApi__Numeric } from "./schema-numeric";
import { SchemaApi__String } from "./schema-string";
import { SchemaApi__Domain } from "./Domains";

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
    & SchemaApi__Object
    & SchemaApi__Domain;

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
