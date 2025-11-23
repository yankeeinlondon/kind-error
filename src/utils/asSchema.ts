import { 
    isArray, 
    isDictionary, 
    isScalar, 
    Never, 
    Scalar 
} from "inferred-types";
import { SchemaCallback } from "~/types";
import { schemaObject, schemaProp, schemaTuple } from "./schema";


export function asSchema<
    const T extends SchemaCallback | Scalar | readonly (Scalar | SchemaCallback)[] | Record<string, Scalar | SchemaCallback>
>(
    schema: T
) {

    return (
        isArray(schema)
            ? schemaTuple(schema as any)
            : isDictionary(schema)
                ? schemaObject(schema)
                : isScalar(schema)
                    ? schemaProp(schema as SchemaCallback)
                    : Never

    )
}
