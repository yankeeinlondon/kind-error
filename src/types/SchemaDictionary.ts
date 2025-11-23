import type { Narrowable, Scalar } from "inferred-types";
import type { SchemaCallback } from "./SchemaCallback";

/**
 * **SchemaDictionary**
 *
 * A `SchemaDictionary` is a dictionary of key/value pairs. The _values_ can
 * consist of either a scalar literal type or a `SchemaCallback` to define the
 * type via the `SchemaApi`.
 *
 * **Related:** `FromSchema`, `SchemaApi`, `SchemaCallback`
 */
export type SchemaDictionary<N extends Narrowable = Narrowable> = Record<
  string,
    Scalar | N[] | Record<string, N> | SchemaCallback
>;
