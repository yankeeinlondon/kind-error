export function toJsonFn(
  err: any,
) {
  return () => {
    const stack = err.stackTrace;
    const first = stack[0];
    return first?.function
      ? {
          name: err.name,
          kind: err.kind,
          message: err.message,
          fn: first.function,
          line: first.line,
          stack: err.stack,
        }
      : {
          name: err.name,
          kind: err.kind,
          message: err.message,
          line: first?.line,
          stack: err.stack,
        };
  };
}
