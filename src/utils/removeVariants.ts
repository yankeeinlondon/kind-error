import { NonVariants } from "~/types";

/**
 * **removeVariants**`(schema) -> Record<string,unknown>`
 * 
 * Reduces the key/value pairs in the `KindErrorType`'s context schema
 * to only those key/values which are static/literal key/values and **not**
 * where the value is _type reference_.
 */
export function removeVariants<T extends Record<string, unknown>>(schema: T): NonVariants<T> {
    //TODO
    return schema as NonVariants<T>;
}
