import type { KindStackItem } from "~/types";

/**
 * Converts a structured stack trace back to a string
 * based `stack` property.
 */
export function toStackString(
  message: string,
  stack: KindStackItem[],
): string {
  // The first line is the error message
  const lines = [message];
  for (const frame of stack) {
    if (frame.raw) {
      // Remove leading 'at ' if present
      const raw = frame.raw.trim().replace(/^at\s+/, "");
      lines.push(`    at ${raw}`);
    }
    else {
      const fn = frame.function ? `${frame.function} ` : "";
      const loc = frame.file
        ? `${frame.file}${frame.line !== undefined ? `:${frame.line}` : ""}${frame.col !== undefined ? `:${frame.col}` : ""}`
        : "";
      lines.push(`    at ${fn}(${loc})`);
    }
  }
  return lines.join("\n");
}
