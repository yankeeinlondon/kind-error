export function stripFirstStackFrame<T extends string | undefined>(
  stack?: string,
): T extends string ? string : undefined {
  if (!stack)
    return stack as T extends string ? string : undefined;
  const lines = stack.split("\n");
  // The first line is the error message, so remove the second line (first stack frame)
  if (lines.length > 2) {
    lines.splice(1, 1);
  }
  return lines.join("\n") as T extends string ? string : undefined;
}
