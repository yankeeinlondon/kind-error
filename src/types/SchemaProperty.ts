import type { Scalar } from "inferred-types";
import type { SchemaCallback } from "~";

/**
 * **SchemaProperty**
 *
 * Represents a `property` in a schema definition.
 */
export type SchemaProperty = Scalar | SchemaCallback;
