import { Scalar } from "inferred-types";
import { SchemaCallback } from "./SchemaCallback";

/**
 * **SchemaTuple**
 * 
 * A tuple of scalar values or `ScalarCallback` functions.
 */
export type SchemaTuple = readonly (Scalar | SchemaCallback)[];
