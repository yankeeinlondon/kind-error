import { 
    isFunction, 
    Never, 
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
    FromSchemaTuple, 
    RuntimeToken, 
    SchemaApi, 
    SchemaCallback, 
    SchemaResult 
} from "~/types";

import { 
    SCHEMA_API_DOMAIN, 
    SCHEMA_API_STRING, 
    SCHEMA_API_NUMERIC, 
    SCHEMA_API_ATOMIC, 
    SCHEMA_API_OBJECT,
    SCHEMA_API_ARRAY_TUPLE
} from './index';
import { asToken } from '~/utils';



export const SCHEMA_API = {
    kind: "SchemaApi",

    ...SCHEMA_API_STRING,
    ...SCHEMA_API_NUMERIC,
    ...SCHEMA_API_ARRAY_TUPLE,
    ...SCHEMA_API_OBJECT,
    ...SCHEMA_API_ATOMIC,
    ...SCHEMA_API_DOMAIN,

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
    return asToken(
        () => 
        isFunction(rtn)
        ? rtn()
        : isDefineSchema(rtn)
        ? Never
        : rtn
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
            ? (t(SCHEMA_API) as RuntimeToken)() 
            : t?.toString()).join(", ")}>>`
    ) as unknown as FromSchemaTuple<[...T]>
}
