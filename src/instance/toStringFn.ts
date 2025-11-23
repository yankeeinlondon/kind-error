import type { Dictionary } from "inferred-types";
import type { KindError, Stringifyable } from "~/types";
import chalk from "chalk";
import { Never } from "inferred-types";
import { resolve } from "pathe";
import { fileLink, link } from "~/link";
import { isStringifyable } from "~/type-guards";
/**
 * creates the `toString()` function for a `KindError`
 */
export function toStringFn<
  TErr extends KindError<TName, TMsg, TCtx>,
  TName extends string,
  TMsg extends string,
  const TCtx extends Record<string, unknown>,
>(
  err: TErr,
): () => string {
  const { name, message, stackTrace } = err;

  return () => {
    const frames = stackTrace();
    const first = frames[0];
    const func = first?.function
      ? ` inside the function ${`${chalk.bold(first.function)}()`}`
      : "";
    const fileInfo = first?.file && first?.line
      ? `\n\n${chalk.italic("in ")}file ${chalk.bold.blue(link(first.file, resolve(first.file)))} at line ${chalk.bold(first.line)}${func}`
      : "";

    const stack = frames.slice(1).length > 0
      ? `\n${frames.slice(1).map(l => `    - ${chalk.blue(fileLink(l?.file))}:${l?.line}:${l?.col}${l?.function ? ` in ${chalk.bold(`${l?.function}()`)}` : ""}`).join("\n")}`
      : "";

    const context = Object.keys(err.context).length > 0
      ? `\n\nContext:\n${Object.keys(err.context).map(
        (key) => {
          const context = err.context as Dictionary;
          const value = (
            key in context
              ? isStringifyable(context[key])
                ? context[key]
                : Never
              : null
          ) as Stringifyable;

          return `\n  ${`${chalk.bold.green(key)}: `}${JSON.stringify(value)}`;
        },
      )}`
      : "";

    return `\n${chalk.bold.red(`${name} Error: `)}${message}${fileInfo}${stack}${context}`;
  };
}
