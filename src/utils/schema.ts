import { 
    isFunction, 
    Never, 
    Suggest, 
    InputTokenSuggestions, 
    FromInputToken__String, 
    ObjectKey, 
    toJson, 
    Narrowable, 
    FromInputToken__Tuple, 
    As,
    Scalar
} from 'inferred-types';
import { isDefineSchema } from "~/type-guards";
import { 
    FromSchema, 
    FromSchemaTuple, 
    RecordKeySuggestions, 
    SchemaApi, 
    SchemaApi__ArrayTuple, 
    SchemaApi__Atomic, 
    SchemaApi__Domain, 
    SchemaApi__Numeric, 
    SchemaApi__Object, 
    SchemaApi__String, 
    SchemaCallback, 
    SchemaResult 
} from "~/types";
import { asToken } from './asToken';
import { Email, EmailDomain } from '~/types/Domains';

const SCHEMA_API_STRING: SchemaApi__String = {
   string<T extends readonly string[]>(...literals: T) {
        return asToken(() => literals.length === 0 ? "string" : literals.join(" | ")) as unknown as [] extends T ? string : T[number];
    },

    optString<T extends readonly string[]>(...literals: T) {
        return asToken(() => literals.length === 0 ? "string | undefined" : `${literals.join(" | ")} | undefined`) as unknown as [] extends T ? string | undefined : T[number] | undefined;
    },

    startsWith<T extends readonly string[]>(...literals: T) {
        return asToken(() => `${literals.join(" | ")}{{String}}`) as any;
    },

    endsWith<T extends readonly string[]>(...literals: T) {
        return asToken(() => `{{String}}${literals.join(" | ")}`) as any;
    },

    suggest<T extends readonly string[]>(...suggestions: T) {
        return asToken(() => `Suggest<${suggestions.join(' | ')}>`) as unknown as [] extends T ? string : Suggest<T[number]>;
    }
}

const SCHEMA_API_NUMERIC: SchemaApi__Numeric = {
   number<T extends readonly number[]>(...literals: T) {
        return asToken(() => literals.length === 0 ? "number" : literals.join(" | ")) as unknown as [] extends T ? number : T[number]
    },

    optNumber<T extends readonly number[]>(...literals: T) {
        return asToken(() => literals.length === 0 ? "number | undefined" : `${literals.join(" | ")} | undefined`) as unknown as [] extends T ? number | undefined : T[number] | undefined
    },
    bigInt() {
        return asToken(() => "BigInt") as unknown as BigInt;
    },
    optBigInt() {
        return asToken(() => "BigInt | undefined") as unknown as BigInt | undefined;
    }
}

const SCHEMA_API_ARRAY_TUPLE: SchemaApi__ArrayTuple = {

    array<const T extends readonly InputTokenSuggestions[]>(...members: T) {
        return asToken(() => JSON.stringify(members)) as unknown as As<FromInputToken__Tuple<T>, readonly unknown[]>[number][]
    },

    optArray<const T extends readonly InputTokenSuggestions[]>(...members: T) {
        return asToken(() => JSON.stringify(members)) as unknown as T[number][] | undefined
    },

    tuple<const T extends readonly InputTokenSuggestions[]>(...members: T): FromInputToken__Tuple<T> {
        return asToken(() => JSON.stringify(members)) as unknown as As<FromInputToken__Tuple<T>, readonly unknown[]>
    },

    optTuple<const T extends readonly InputTokenSuggestions[]>(...members: T) {
        return asToken(() => JSON.stringify(members)) as unknown as As<FromInputToken__Tuple<T>, readonly unknown[]> | undefined
    }
}

const SCHEMA_API_OBJECT: SchemaApi__Object = {

    map<K extends InputTokenSuggestions, V extends InputTokenSuggestions>(
        key: K, value: V
    ): Map<FromInputToken__String<K>, FromInputToken__String<V>> {
        return asToken(() => `Map<${key}, ${value}>`) as unknown as Map<FromInputToken__String<K>, FromInputToken__String<V>>
    },

    set<T extends InputTokenSuggestions>(val: T): Set<FromInputToken__String<T>> {
        return asToken(() => `Set<${val}>`) as unknown as Set<FromInputToken__String<T>>
    },

    optSet<T extends InputTokenSuggestions>(val: T): Set<FromInputToken__String<T>> {
        return asToken(() => `Set<${val}> | undefined`) as unknown as Set<FromInputToken__String<T>>
    },
    
    record<K extends RecordKeySuggestions, V extends InputTokenSuggestions>(
        key: K, 
        value: V
    ) {
        return asToken(() => `Record<${key}, ${value}>`) as unknown as FromInputToken__String<K> extends infer Key extends ObjectKey 
            ? Record<
                Key,
                FromInputToken__String<V>
            >
        : never
    },

    optRecord<K extends RecordKeySuggestions, V extends InputTokenSuggestions>(
        key: K, 
        value: V
    ) {
        return asToken(() => `Record<${key}, ${value}>`) as unknown as FromInputToken__String<K> extends infer Key extends ObjectKey 
            ? Record<
                Key,
                FromInputToken__String<V>
            > & undefined
        : never
    },


    dictionary<const T extends Record<string, N[] | Record<string,N> | SchemaCallback>, N extends Narrowable>(
        dict: T
    ) {
        return asToken(() => toJson(dict)) as unknown as FromSchema<T>;
    },

    optDictionary<const T extends Record<string, N[] | Record<string,N> | SchemaCallback>, N extends Narrowable>(
        dict: T
    ) {
        return asToken(() => toJson(dict)) as unknown as FromSchema<T> | undefined;
    }
}

const SCHEMA_API_ATOMIC: SchemaApi__Atomic = {
    boolean() {
        return asToken(() => "boolean") as unknown as boolean
    },
    true: () => asToken(() => "true") as unknown as true,
    false: () => asToken(() => "false") as unknown as false,
    null: () => asToken(() => "null") as unknown as null,
    undefined: () => asToken(() => "undefined") as unknown as undefined,
}

const SCHEMA_API_DOMAIN: SchemaApi__Domain = {
    /**
     * 
     */
    email<T extends readonly EmailDomain[]>(...constraints: T) {
        return asToken(() => constraints.length === 0 ? `<<email>>` : `<<email::${constraints.join(", ")}>>`) as unknown as [] extends T ? Email : Email<T>;
    }
}

const SCHEMA_API = {
    kind: "SchemaApi",

    ...SCHEMA_API_STRING,
    ...SCHEMA_API_NUMERIC,
    ...SCHEMA_API_ARRAY_TUPLE,
    ...SCHEMA_API_OBJECT,
    ...SCHEMA_API_ATOMIC,

    union<const T extends readonly unknown[]>(...members: T): T[number] {
        return asToken(() => members.join(" | ")) as unknown as T[number]
    },
} as SchemaApi;

/**
 * **schemaProp**`(cb) => type`
 * 
 * Defines a _type_ for property in a schema.
 */
export function schemaProp<T extends SchemaCallback>(cb: T): SchemaResult<T> {
    const rtn = cb(SCHEMA_API);
    return (
        isFunction(rtn)
        ? rtn()
        : isDefineSchema(rtn)
        ? Never
        : rtn
    ) as SchemaResult<T>;
}


export function schemaTuple<const T extends readonly (Scalar | SchemaCallback)[]>(...elements: T) {
    return asToken(
        () => `<<tuple::${elements.map(t => t?.toString()).join(", ")}>>`
    ) as unknown as FromSchemaTuple<[...T]>
}
