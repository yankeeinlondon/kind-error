import type { LambdaError } from "~/types";
import { isObject } from "inferred-types";

/**
 * a type guard which checks whether `val` is in the shape of a AWS Lambda error.
 */
export function isAwsLambdaError(val: unknown): val is LambdaError {
  return isObject(val)
    && "errorMessage" in val
    && "errorType" in val
    && typeof val.errorMessage === "string"
    && typeof val.errorType === "string";
}
