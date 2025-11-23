import type { Scalar } from "inferred-types";
import type { SchemaCallback } from "./SchemaCallback";

/**
 * **SchemaTuple**
 *
 * A tuple of scalar values or `ScalarCallback` functions.
 */
export type SchemaTuple = readonly (Scalar | SchemaCallback)[];
