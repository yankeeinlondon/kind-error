import type { KindError } from "~/types";

export function toJsonFn<T extends KindError<any, any, any>>(
  err: T,
) {
  return () => {
    const stack = err.stackTrace();
    const first = stack[0];
    return first?.function
      ? {
        name: err.name,
        kind: err.kind,
        message: err.message,
        context: err.context,
        fn: first.function,
        line: first.line,
        stack: err.stack,
      }
      : {
        name: err.name,
        kind: err.kind,
        message: err.message,
        context: err.context,
        line: first?.line,
        stack: err.stack,
      };
  };
}
