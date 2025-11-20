import { 
    isFunction, 
    Never, 
    Suggest, 
    InputTokenSuggestions, 
    FromInputToken__String, 
    ObjectKey, 
    toJson, 
    Narrowable, 
    FromInputToken__Tuple 
} from 'inferred-types';
import { isDefineSchema } from "~/type-guards";
import { FromSchema, RecordKeySuggestions, SchemaApi, SchemaCallback, SchemaResult } from "~/types";
import { asToken } from './asToken';

const SCHEMA_API = {
    kind: "SchemaApi",

    boolean() {
        return asToken(() => "boolean") as unknown as boolean
    },
    true: () => asToken(() => "true") as unknown as true,
    false: () => asToken(() => "false") as unknown as false,
    null: () => asToken(() => "null") as unknown as null,
    undefined: () => asToken(() => "undefined") as unknown as undefined,

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
    },

    number<T extends readonly number[]>(...literals: T) {
        return asToken(() => literals.length === 0 ? "number" : literals.join(" | ")) as unknown as [] extends T ? number : T[number]
    },

    optNumber<T extends readonly number[]>(...literals: T) {
        return asToken(() => literals.length === 0 ? "number | undefined" : `${literals.join(" | ")} | undefined`) as unknown as [] extends T ? number | undefined : T[number] | undefined
    },

    union<const T extends readonly unknown[]>(...members: T): T[number] {
        return asToken(() => members.join(" | ")) as unknown as T[number]
    },

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

    array<const T extends readonly InputTokenSuggestions[]>(...members: T) {
        return asToken(() => toJson(members)) as unknown as FromInputToken__Tuple<T>[number][]
    },

    optArray<const T extends readonly InputTokenSuggestions[]>(...members: T) {
        return asToken(() => toJson(members)) as unknown as T[number][] | undefined
    },

    tuple<const T extends readonly InputTokenSuggestions[]>(...members: T): FromInputToken__Tuple<T> {
        return asToken(() => toJson(members)) as unknown as FromInputToken__Tuple<T>
    },

    optTuple<const T extends readonly InputTokenSuggestions[]>(...members: T) {
        return asToken(() => toJson(members)) as unknown as FromInputToken__Tuple<T> | undefined
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

};

/**
 * **schemaProp**`(cb) => type`
 * 
 * Defines a _type_ for property in a schema.
 */
export function schemaProp<T extends SchemaCallback>(cb: T): SchemaResult<T> {
    const rtn = cb(SCHEMA_API as unknown as SchemaApi);
    return (
        isFunction(rtn)
        ? rtn()
        : isDefineSchema(rtn)
        ? Never
        : rtn
    ) as SchemaResult<T>;
}
