import type { TypedFunction } from "inferred-types/types";

export function renameFunction<T extends TypedFunction, N extends string>(
  fn: T,
  name: N,
) {
  return Object.defineProperty(
    (...args: any[]) => {
      return fn(...args); // <-- fix here
    },
    "name",
    { value: name, writable: false },
  ) as T;
}
