import { TypedFunction } from "inferred-types";
import { SchemaApi } from "./SchemaApi";


/**
 * **SchemaCallback**
 *
 * A callback which is provided the `SchemaApi` in order to define
 * the _type_ of a given schema element for the `KindErrorType`'s
 * context schema.
 *
 * - if a `SchemaCallback` returns _itself_ this will be treated as the _never_ type
 * - if a function is returned then the return type of the function with no parameters
 *   passed in will be returned.
 *
 * The callback receives the `SchemaApi` instance so callers can infer return types from
 * the API surface.
 */
export type SchemaCallback<TReturn = unknown> = (api: SchemaApi) => TReturn;

