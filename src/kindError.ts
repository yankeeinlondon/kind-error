import type { Dictionary, EmptyObject, KebabCase, MergeObjects, Narrowable } from "inferred-types";

import type { DefineKindError, KindErrorType, PascalKind } from "./types";

import { parse } from "error-stack-parser-es/lite";
import {
  createFnWithProps,
  mergeObjects,
  stripChars,
  toKebabCase,
  toPascalCase,
} from "inferred-types";
import { relative } from "pathe";

const IGNORABLES = ["@vitest/runner", "node:"];

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
    const stackTrace = parse(err as Error)
      .filter(i => !IGNORABLES.some(has => i.file && i.file.includes(has)))
      .map(i => ({
        ...i,
        file: i.file ? relative(".", i.file) : undefined,
      }));

    err.name = toPascalCase(kind);
    err.kind = kind;
    err.file = stackTrace[0].file;
    err.line = stackTrace[0].line;
    err.col = stackTrace[0].col;
    err.stackTrace = stackTrace;
    err.__kind = "KindError";
    err.context = {
      ...baseContext,
      ...(context || {}),
    };

    return err;
  };

  const typeFn: DefineKindError<PascalKind<TKind>, TBase> = (msg: string, context?: Record<string, Narrowable>) => {
    return fn(msg, context);
  };

  const props = {
    kind: "KindErrorType",
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
  };

  return createFnWithProps(typeFn, props) as KindErrorType<
    PascalKind<TKind>,
    TBase
  >;
}
