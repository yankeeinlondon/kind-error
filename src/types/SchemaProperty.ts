import type { Scalar } from "inferred-types";
import type { SchemaCallback } from "./SchemaCallback";

/**
 * **SchemaProperty**
 *
 * Represents a `property` in a schema definition.
 */
export type SchemaProperty = Scalar | SchemaCallback;
