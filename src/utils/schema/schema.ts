import {
    Dictionary,
    Scalar,
    EN_SPACE,
    THIN_SPACE,
    narrow
} from "inferred-types";
import type {
    DetectOptionalValues,
    FromSchemaObject,
    FromSchemaTuple,
    AsRuntimeToken,
    SchemaApi,
    SchemaCallback,
    SchemaResult,
} from "~/types";
import {
    isArray,
    isDictionary,
    isFunction,
    isScalar,
    Never,
} from "inferred-types";
import { isSchemaDictionary } from "~/type-guards";

import { asToken } from "../asToken";
import { SCHEMA_API_ARRAY_TUPLE } from "./array-impl";
import { SCHEMA_API_ATOMIC } from "./atomic-impl";
import { SCHEMA_API_DOMAIN, setSchemaApi } from "./domain-impl";
import { SCHEMA_API_NUMERIC } from "./numeric-impl";
import { SCHEMA_API_OBJECT } from "./object-impl";
import { SCHEMA_API_STRING } from "./string-impl";

export const UNION_DELIMITER = `${EN_SPACE}|${EN_SPACE}` as const;
export const TOKEN_START = narrow(`<<${THIN_SPACE}`);
export const TOKEN_END = `${THIN_SPACE}>>` as const;

export const SCHEMA_API = {
    kind: "SchemaApi",

    ...SCHEMA_API_STRING,
    ...SCHEMA_API_NUMERIC,
    ...SCHEMA_API_ARRAY_TUPLE,
    ...SCHEMA_API_OBJECT,
    ...SCHEMA_API_ATOMIC,
    ...SCHEMA_API_DOMAIN,

    union<const T extends readonly unknown[]>(...members: T): T[number] {
        return asToken(() => members.join(UNION_DELIMITER)) as unknown as T[number];
    },
} as SchemaApi;

setSchemaApi(SCHEMA_API);

/**
 * **schemaProp**`(cb) => type`
 *
 * Defines a _type_ for property in a schema.
 */
export function schemaProp<T extends SchemaCallback>(cb: T): SchemaResult<T> {
    const rtn = cb(SCHEMA_API);
    return asToken(
        () =>
            isFunction(rtn)
                ? rtn()
                : isSchemaDictionary(rtn)
                    ? Never
                    : rtn,
    ) as SchemaResult<T>;
}

/**
 * **schemaTuple**`(...elements)`
 *
 * Creates `RuntimeToken`s for runtime values while converting to the
 * tuple type that these tokens are meant to represent.
 */
export function schemaTuple<const T extends readonly (Scalar | SchemaCallback)[]>(...elements: T) {
    return asToken(
        () => `<<tuple::${elements.map(t => isFunction(t)
            ? (t(SCHEMA_API) as AsRuntimeToken)()
            : t?.toString()).join(", ")}>>`,
    ) as unknown as FromSchemaTuple<[...T]>;
}

/**
 * **schemaObject**`(defn)`
 *
 * Creates an object with resolved types.
 */
export function schemaObject<const T extends Record<string, Scalar | SchemaCallback>>(defn: T) {
    const output: Dictionary = {};

    for (const k of Object.keys(defn)) {
        const val = isFunction(defn[k])
            ? defn[k](SCHEMA_API)
            : defn[k];

    }

    return asToken(() => output) as unknown as DetectOptionalValues<FromSchemaObject<T>>
}


export function asSchema<
    const T extends SchemaCallback | Scalar | readonly (Scalar | SchemaCallback)[] | Record<string, Scalar | SchemaCallback>
>(
    schema: T
) {

    return (
        isArray(schema)
            ? schemaTuple(schema as any)
            : isDictionary(schema)
                ? schemaObject(schema)
                : isScalar(schema)
                    ? schemaProp(schema as SchemaCallback)
                    : Never

    )

}
