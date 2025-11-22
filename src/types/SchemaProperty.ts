import { Scalar } from "inferred-types";
import { SchemaCallback } from "~";

/**
 * **SchemaProperty**
 * 
 * Represents a `property` in a schema definition.
 */
export type SchemaProperty = Scalar | SchemaCallback;
