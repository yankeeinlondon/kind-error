import { isFunction } from "inferred-types";
import { Email, EmailDomain, SchemaApi__Domain, CreateNetmask, Ip4Address, Netmask } from "~/types";
import { asToken, SCHEMA_API } from "~/utils";



export const SCHEMA_API_DOMAIN: SchemaApi__Domain = {
    email<T extends readonly EmailDomain[]>(...constraints: T) {
        const c = constraints.map(
            i => isFunction(i)
                ? i(SCHEMA_API)()
                : i
        )
        return asToken(() => constraints.length === 0 
                ? `<<email>>` 
                : `<<email::${c.join(", ")}>>`
        ) as unknown as [] extends T ? Email : Email<T>;
    },

    ip4Address<const T extends CreateNetmask | Netmask | undefined = undefined>(filter?: T) {
        return asToken(
            () => filter ? `<<ip4address>>` : `<<ip4address::${filter}>>`
        ) as unknown as Ip4Address<T>
    }
} as const;
