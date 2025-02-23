import type {
  Dictionary,
  EmptyObject,
  KebabCase,
  MergeObjects,
  Narrowable,
} from "inferred-types";

import type {
  DefineKindError,
  KindError,
  KindErrorType,
  KindErrorType__Props,
  PascalKind,
} from "./types";

import { inspect } from "node:util";

import chalk from "chalk";
import { parse } from "error-stack-parser-es/lite";
import {
  createFnWithPropsExplicit,
  mergeObjects,
  stripChars,
  toKebabCase,
  toPascalCase,
} from "inferred-types";
import { relative } from "pathe";
import { isKindError } from "./isKindError";

const IGNORABLES = ["@vitest/runner", "node:", "native"];

/**
 * **createKindError**`(kind, baseContext) → (msg, ctx) → KindError`
 *
 * A higher order function who's utility is to create a type and context aware
 * error message. The first call defines:
 *
 * - the "kind" used to categorize the error
 * - key/value pairs which represent will eventually be represented
 * in the Error's `context` property.
 *
 * The second call fully applies this function into an Error and takes at
 * minimum a `message` parameter but can also add a second parameter to
 * add to the "context" which the error conveys.
 *
 * ```ts
 * // Defines the Error
 * const BadJuju = kindError("bad-juju", { flavor?: "" });
 * // BadJuju {
 * //     name: BadJuju;
 * //     kind: "bad-juju";
 * //     msg: "oh my god!";
 * //     context: { flavor?: string}
 * // }
 * BadJuju("oh my god!");
 * BadJuju("oh my god!", { flavor: "strawberry"})
 * ```
 */
export function createKindError<
  TKind extends string,
  TBase extends Record<string, BC>,
  BC extends Narrowable,
>(
  kindName: TKind,
  baseContext: TBase = {} as EmptyObject as TBase,
): KindErrorType<
    PascalKind<TKind>,
    TBase
  > {
  const kind = toKebabCase(
    stripChars(kindName, "<", ">", "[", "]", "(", ")"),
  ) as KebabCase<PascalKind<TKind>>;

  const fn = <TErrContext extends Record<string, N>, N extends Narrowable>(
    msg: string,
    context?: TErrContext,
  ) => {
    const err = new Error(msg) as any;
    const stackTrace = parse(err as Error).slice(1).filter(
      i => !IGNORABLES.some(has => i.file && i.file.includes(has)),
    ).map(i => ({
      ...i,
      file: i.file ? relative(".", i.file) : undefined,
    }));

    err.name = toPascalCase(kind);
    err.kind = kind;
    err.file = stackTrace[0].file;
    err.line = stackTrace[0].line;
    err.col = stackTrace[0].col;
    err.fn = stackTrace[0].function;
    err.stackTrace = stackTrace;
    err.__kind = "KindError";
    err.__errorType = Symbol("KindError");
    err.context = {
      ...baseContext,
      ...(context || {}),
    };
    err.toString = () => {
      const func = err.fn
        ? ` inside the function ${`${chalk.bold(err.fn)}()`}`
        : "";
      const fileInfo = err.file && err.line
        ? `\n\n${chalk.italic("in ")}file ${chalk.bold.blue(err.file)} at line ${chalk.bold(err.line)}${func}`
        : "";

      const stack = stackTrace.slice(1).length > 0
        ? `\n${stackTrace.slice(1).map(l => `    - ${chalk.blue(l.file)}:${l.line}:${l.col}${l.function ? ` in ${chalk.bold(`${l.function}()`)}` : ""}`).join("\n")}`
        : "";

      const context = Object.keys(err.context).length > 0
        ? `\n\nContext:\n${Object.keys(err.context).map(
          key => `\n  ${`${chalk.bold.green(key)}: `}${JSON.stringify(err.context[key])}`,
        )}`
        : "";

      return `\n${chalk.bold.red(`${toPascalCase(kind)} Error: `)}${msg}${fileInfo}${stack}${context}`;
    };
    err.toJSON = () => JSON.stringify({
      name: err.name,
      kind: err.kind,
      msg: err.msg,
      context: err.context,
      stack: err.stackTrace,
    });
    err[inspect.custom] = (_depth: number, _options: unknown) => {
      return err.toString();
    };
    err.asBrowserMessage = () => {
      const func = err.fn
        ? ` inside the function ${err.fn}()`
        : "";
      const fileInfo = err.file && err.line
        ? ["Entry:", `in file ${err.file} at line ${err.line}${func}`]
        : undefined;

      const stack = stackTrace.slice(1).length > 0
        ? ["Stack:", stackTrace.slice(1)]
        : undefined;

      const context = Object.keys(err.context).length > 0
        ? ["Context:", err.context]
        : undefined;

      return [
        ["Message:", msg],
        fileInfo,
        stack,
        context,
      ].filter(i => i);
    };

    return err;
  };

  const typeFn: DefineKindError<PascalKind<TKind>, TBase> = (msg: string, context?: Record<string, Narrowable>) => {
    return fn(msg, context);
  };

  const props = {
    __kind: "KindErrorType",
    kind,
    errorType: null as unknown as KindError<TKind, TBase>,
    rebase: <
      T extends Dictionary<string, N>,
      N extends Narrowable,
    >(context: T) => {
      const merged = mergeObjects(baseContext, context);
      return createKindError(kindName, merged) as unknown as KindErrorType<
        TKind,
        MergeObjects<TBase, T>
      >;
    },
    proxy(err) {
      const error = isKindError(err) ? err : fn(err.message, { underlying: err });
      return error;
    },
    is(val) {
      return isKindError(val) && (val as any).kind === toKebabCase(kindName);
    },
  } as KindErrorType__Props<
    PascalKind<TKind>,
    TBase
  >;

  return createFnWithPropsExplicit(typeFn, props) as unknown as KindErrorType<
    PascalKind<TKind>,
    TBase
  >;
}
