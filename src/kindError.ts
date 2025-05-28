import type {
  EmptyObject,
  MergeObjects,
  Narrowable,
} from "inferred-types";

import type {
  KindError,
  KindErrorSubTypeProp,
  KindErrorType,
  KindErrorType__Fn,
  KindErrorType__Props,
  KindErrorTypeName,
  KindErrorTypeProp,
} from "src/types";

import { inspect } from "node:util";
import chalk from "chalk";
import {
  stripChars,
  toKebabCase,
  toPascalCase,
} from "inferred-types";
import {
  KindErrorSymbol,

} from "src/types";
import { toJsonFn, toStringFn } from "./instance";
import { isFn, proxyFn, rebaseFn } from "./static";
import { createFnWithPropsExplicit, renameFunction, toStackTrace } from "./utils";
import {
  createStackTrace,
} from "./utils/error-proxies";

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
    TKind,
    TBase
  > {
  /** the "kind" property for the error */
  const kind = kindName.split("/")
    .map(i => toKebabCase(
      stripChars(i, "<", ">", "[", "]", "(", ")"),
    ))
    .join("/") as KindError<TKind, TBase>["kind"];

  /** the "name" property for the error */
  const errorName = toPascalCase(
    kind.replace("/", "-"),
  ) as KindErrorType<TKind>["errorName"];

  /** the "type" and "subType" properties */
  const [type, subType] = kind
    .split("/") as [
    KindErrorTypeProp<TKind>,
    KindErrorSubTypeProp<TKind>,
  ];

  /**
   * The error constructor function
   */
  const fn = <
    TErrContext extends Record<string, N>,
    N extends Narrowable,
  >(
    message: string,
    ctx: TErrContext = {} as EmptyObject as TErrContext,
  ) => {
    const context = {
      ...baseContext,
      ...(ctx || {}),
    } as MergeObjects<TBase, TErrContext>;

    const err = new Error(message) as unknown as MergeObjects<TBase, TErrContext> extends Record<string, Narrowable>
      ? KindError<
        TKind,
        MergeObjects<TBase, TErrContext>
      > & Error
      : never;

    const stackTrace = createStackTrace(err);
    const file = stackTrace ? stackTrace[0]?.file || "" : "";
    const line = stackTrace ? stackTrace[0]?.line : undefined;
    const col = stackTrace ? stackTrace[0]?.col : undefined;
    const fn = stackTrace ? stackTrace[0]?.function : undefined;

    err[KindErrorSymbol] = "KindError";
    err.name = errorName;
    err.message = message;
    err.kind = kind;
    err.type = type;
    err.subType = subType;
    err.file = file;
    err.fn = fn;
    err.line = line;
    err.col = col;
    err.context = context;
    err.stackTrace = () => stackTrace;
    err.stack = toStackTrace(message, stackTrace);

    err.toString = toStringFn(err as any);

    err.toJSON = toJsonFn(err as any);

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
        ["Message:", message],
        fileInfo,
        stack,
        context,
      ].filter(i => i);
    };

    return err;
  };

  /**
   * The function portion of the error type
   */
  const kindErrorConstructor = createFnWithPropsExplicit((
    msg: string,
    context?: Record<string, Narrowable>,
  ) => {
    return fn(msg, context);
  }, { name: errorName });

  const constructor = renameFunction(
    fn,
    `${errorName}ErrorType` as KindErrorTypeName<TKind>,
  ) as KindErrorType__Fn<TKind, TBase>;

  const proxy = proxyFn(kind, errorName, baseContext);
  const rebase = rebaseFn(kind, baseContext);
  const is = isFn(kindName);

  /**
   * The properties of the error type
   */
  const props = {
    [KindErrorSymbol]: "KindErrorType",
    kind,
    type,
    subType,
    errorName,
    proxy,
    context: baseContext,
    rebase,
    is,
    toJSON() {
      return {
        __kind: "KindErrorType",
        name: `${errorName}ErrorType`,
        kind,
        type,
        context: baseContext,
        subType,
        errorName,
      };
    },
    toString() {
      return `KindErrorType::${errorName}(${type}/${subType})`;
    },
    toConsole() {
      return `KindErrorType::${chalk.bold.yellow(errorName)}(${type}${chalk.dim("/")}${subType})`;
    },
  } as unknown as KindErrorType__Props<
    TKind,
    TBase
  >;

  const err = createFnWithPropsExplicit(
    constructor,
    props,
  ) as unknown as KindErrorType<TKind, TBase>;

  return err as KindErrorType<TKind, TBase>;
}
