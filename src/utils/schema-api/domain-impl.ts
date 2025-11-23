import type { CreateNetmask, Email, EmailDomain, Ip4Address, Netmask, SchemaApi__Domain } from "~/types/schema-api";

import { isFunction } from "inferred-types";
import { asRuntimeTokenCallback } from "~/utils";
import { COMMA_DELIMITER } from "~/utils/schema";

let _schemaApi: any;

export function setSchemaApi(api: any) {
  _schemaApi = api;
}

export const SCHEMA_API_DOMAIN: SchemaApi__Domain = {
  email<T extends readonly EmailDomain[]>(...constraints: T) {
    const c = constraints.map(
      (i) => {
        if (isFunction(i)) {
          const result = i(_schemaApi);
          return isFunction(result) ? result() : result;
        }
        return i;
      },
    );
    return asRuntimeTokenCallback(constraints.length === 0
      ? `email`
      : `email::${c.join(COMMA_DELIMITER)}`,
    ) as unknown as [] extends T ? Email : Email<T>;
  },

  ip4Address<const T extends CreateNetmask | Netmask | undefined = undefined>(filter?: T) {
    return asRuntimeTokenCallback(
      filter
        ? `ip4Address`
        : `ip4Address::${filter}`,
    ) as unknown as Ip4Address<T>;
  },
} as const;
