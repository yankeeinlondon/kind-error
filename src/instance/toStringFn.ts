import type { Dictionary, Narrowable } from "inferred-types";
import type { KindError, Stringifiable } from "src/types";
import chalk from "chalk";
import { Never } from "inferred-types";
import { resolve } from "pathe";
import { fileLink, link } from "src/link";
import { isStringifiable } from "src/type-guards";

export function toStringFn<
  T extends KindError<K, C>,
  K extends string,
  C extends Record<string, N>,
  N extends Narrowable,
>(
  err: T,
): () => string {
  const { name, message, stackTrace } = err;

  return () => {
    const func = err.fn
      ? ` inside the function ${`${chalk.bold(err.fn)}()`}`
      : "";
    const fileInfo = err.file && err.line
      ? `\n\n${chalk.italic("in ")}file ${chalk.bold.blue(link(err.file, resolve(err.file)))} at line ${chalk.bold(err.line)}${func}`
      : "";

    const stack = stackTrace().slice(1).length > 0
      ? `\n${stackTrace().slice(1).map(l => `    - ${chalk.blue(fileLink(l?.file))}:${l?.line}:${l?.col}${l?.function ? ` in ${chalk.bold(`${l?.function}()`)}` : ""}`).join("\n")}`
      : "";

    const context = Object.keys(err.context).length > 0
      ? `\n\nContext:\n${Object.keys(err.context).map(
        (key) => {
          const context = err.context as Dictionary;
          const value = (
            key in context
              ? isStringifiable(context[key])
                ? context[key]
                : Never
              : null
          ) as Stringifiable;

          return `\n  ${`${chalk.bold.green(key)}: `}${JSON.stringify(value)}`;
        },
      )}`
      : "";

    return `\n${chalk.bold.red(`${name} Error: `)}${message}${fileInfo}${stack}${context}`;
  };
}
