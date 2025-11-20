import {  isFunction,  Never,  Suggest,  InputTokenSuggestions,  FromInputToken__String } from 'inferred-types';
import { isDefineSchema } from "~/type-guards";
import { SchemaApi, SchemaCallback, SchemaResult } from "~/types";
import { asToken } from './asToken';

const SCHEMA_API: SchemaApi = {
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

    map<
        K extends InputTokenSuggestions, V extends InputTokenSuggestions
    >(key: K, value: V): Map<FromInputToken__String<K>, FromInputToken__String<V>> {
        return asToken(() => `Map<${key}, ${value}>`) as unknown as Map<FromInputToken__String<K>, FromInputToken__String<V>>
    },

    set<V extends InputTokenSuggestions>(val: V): Set<FromInputToken__String<V>> {
        return asToken(() => `Set<${val}>`) as unknown as Set<FromInputToken__String<V>>
    }

};




export function propertySchema<T extends SchemaCallback>(cb: T): SchemaResult<T> {
    const rtn = cb(SCHEMA_API);
    return (
        isFunction(rtn)
        ? rtn()
        : isDefineSchema(rtn)
        ? Never
        : rtn
    ) as SchemaResult<T>;
}

