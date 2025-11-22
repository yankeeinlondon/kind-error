import { TypedFunction } from "inferred-types";
import { SchemaApi } from "./SchemaApi";
import { SchemaCallback } from "./SchemaCallback";


/**
 * **SchemaResult**`<T>`
 * 
 * Converts a `SchemaCallback` into the narrowly typed return type for this function.
 * 
 * - if a `SchemaApi` surface is returned then this will result in the type `never`
 * - if the return type is a function then this function will be called; this
 *   allows callers to not even complete their function calls (e.g., `t => t.string`
 *   will still result in a `string` type)
 */
export type SchemaResult<T extends SchemaCallback> = ReturnType<T> extends TypedFunction
  ? ReturnType<ReturnType<T>>
  : ReturnType<T> extends SchemaApi
    ? never
    : ReturnType<T>;
