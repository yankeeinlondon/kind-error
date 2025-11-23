import type {
  Scalar,
} from "inferred-types";
import type { SchemaCallback } from "~/types";
import {
  isArray,
  isDictionary,
  isScalar,
  Never,
} from "inferred-types";
import { schemaObject, schemaProp, schemaTuple } from "./schema";

export function asSchema<
  const T extends SchemaCallback | Scalar | readonly (Scalar | SchemaCallback)[] | Record<string, Scalar | SchemaCallback>,
>(
  schema: T,
) {
  return (
    isArray(schema)
      ? schemaTuple(schema as any)
      : isDictionary(schema)
        ? schemaObject(schema)
        : isScalar(schema)
          ? schemaProp(schema as SchemaCallback)
          : Never

  );
}
