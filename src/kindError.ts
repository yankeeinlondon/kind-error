import type {
  EmptyObject,
  Handle,
  KebabCase,
  MergeObjects,
  Narrowable,
  PascalCase,
} from "inferred-types/types";

import type { KindError, KindErrorDefn, PascalKind } from "./types";

import { parse } from "error-stack-parser-es/lite";
import { stripChars, toKebabCase, toPascalCase } from "inferred-types/runtime";
import { relative } from "pathe";

const IGNORABLES = ["@vitest/runner", "node:"];

/**
 * **kindError**`(kind, baseContext) → (msg, ctx) → KindError`
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
  TBaseContext extends Record<string, BC>,
  BC extends Narrowable = Narrowable,
>(
  kindName: TKind,
  baseContext: TBaseContext = {} as EmptyObject as TBaseContext,
): KindErrorDefn<PascalKind<TKind>, TBaseContext> {
  type SafeKind = PascalKind<TKind>;

  const kind = toKebabCase(
    stripChars(kindName, "<", ">", "[", "]", "(", ")"),
  ) as KebabCase<SafeKind>;

  return <
    TErrContext extends Record<string, C> = EmptyObject,
    C extends Narrowable = Narrowable,
  >(
    msg: string,
    context: TErrContext = {} as EmptyObject as TErrContext,
  ): KindError<PascalKind<TKind>, MergeObjects<TBaseContext, TErrContext>> => {
    const err = new Error(msg) as Partial<
      KindError<
        SafeKind,
        Handle<TBaseContext, undefined, EmptyObject, "equals">
      >
    >;
    const stackTrace = parse(err as Error)
      .filter(i => !IGNORABLES.some(has => i.file && i.file.includes(has)))
      .map(i => ({
        ...i,
        file: i.file ? relative(".", i.file) : undefined,
      }));

    err.name = toPascalCase(kind) as unknown as PascalCase<SafeKind>;
    err.kind = kind;
    err.file = stackTrace[0].file;
    err.line = stackTrace[0].line;
    err.col = stackTrace[0].col;
    err.stackTrace = stackTrace;
    err.__kind = "KindError";
    err.context = {
      ...baseContext,
      ...context,
    };

    return err as unknown as KindError<
      SafeKind,
      MergeObjects<TBaseContext, TErrContext>
    >;
  };
}
