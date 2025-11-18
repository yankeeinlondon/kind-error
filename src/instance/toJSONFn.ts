import type { KindError } from "~/types";

export function toJsonFn<T extends KindError<any, any>>(
  err: T,
) {
  return () => err.fn
    ? {
        name: err.name,
        kind: err.kind,
        message: err.message,
        context: err.context,
        fn: err.fn,
        line: err.line,
        stack: err.stack,
      }
    : {
        name: err.name,
        kind: err.kind,
        message: err.message,
        context: err.context,
        line: err.line,
        stack: err.stack,
      };
}
