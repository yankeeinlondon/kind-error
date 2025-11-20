import { IsFunction, isFunction, narrow, Never, ShapeApi, Suggest, TypedFunction } from "inferred-types";
import { isDefineSchema } from "~/type-guards";
import { SchemaApi, SchemaCallback, SchemaResult } from "~/types";

const SCHEMA_API: SchemaApi = {
    kind: "SchemaApi",

    boolean() {
        return "boolean" as unknown as boolean
    },
    true: () => "true" as unknown as true,
    false: () => "false" as unknown as false,
    null: () => "null" as unknown as null,
    undefined: () => "undefined" as unknown as undefined,

    string<T extends readonly string[]>(...literals: T) {
        return literals as unknown as [] extends T ? string : T[number];
    },
    optString<T extends readonly string[]>(...literals: T) {
        return literals as unknown as [] extends T ? string | undefined : T[number] | undefined;
    },
    suggest<T extends readonly string[]>(...suggestions: T) {
        return suggestions as unknown as [] extends T ? string : Suggest<T[number]>;
    },
    number<T extends readonly number[]>(...literals: T) {
        return literals as unknown as [] extends T ? number : T[number]
    },
    optNumber<T extends readonly number[]>(...literals: T) {
        return literals as unknown as [] extends T ? number | undefined : T[number] | undefined
    },
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

