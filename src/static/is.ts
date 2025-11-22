import type { KindError } from "~/types";
import { toKebabCase } from "inferred-types";
import { isKindError } from "~/type-guards";

/**
 * Higher order function which provides the type-guard to
 * a `KindError`.
 */
export function isFn<T extends string>(
  name: T,
) {
  /** type-guard for `KindError` */
  return (val: unknown): val is KindError<T> => {
    return isKindError(val)
      && (val as any).kind === toKebabCase(name);
  };
}
