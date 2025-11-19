import type { Contains, EmptyObject, Err, MergeObjects } from "inferred-types";
import type { AsContextShape, KindError, KindErrorType, ParseContext } from "~/types";
import { inspect } from "node:util";
import {
  createFnWithProps,
  err,
  toPascalCase,
} from "inferred-types";
import { asKindSubType, asKindType, getStackTrace, renameFunction } from "~/utils";
import { toJsonFn, toStringFn } from "./instance";
import { proxyFn } from "./static";
import { isKindError } from "./type-guards";

type Rtn<
  TName extends string,
  TContext extends Record<string, unknown>,
> = Contains<TName, "<" | ">" | "[" | "]" | "(" | ")"> extends true
  ? Err<
    "invalid-name",
    `The name for a KindError must not include any of the following characters: "<", ">", "[", "]", "(", ")"`
  >
  : KindErrorType<TName, ParseContext<TContext>>;

/**
 * **createKindError**`(name, context)`
 *
 * Creates a `KindErrorType` which can then be called to create
 * the underlying `KindError` instance.
 */
export function createKindError<
  const TName extends string,
  const TContext extends Record<string, unknown>,
>(
  name: TName,
  context: TContext = {} as EmptyObject as TContext,
): Rtn<TName, TContext> {
  if (/[<>[\]()]/.test(name)) {
    return err("invalid-name", `The name for a KindError must not include any of the following characters: "<", ">", "[", "]", "(", ")"`) as Rtn<TName, TContext>;
  }
  const partial = <C extends AsContextShape<TContext>>(ctx: C) => {
    return createKindError(name, { ...context, ...ctx } as MergeObjects<TContext, C>);
  };

  const pascalName = toPascalCase(name.replace(/\//g, "-"));

  const props = {
    __kind: "KindErrorType",
    kind: name,
    errorName: pascalName,
    type: asKindType(name),
    subType: asKindSubType(name),
    context,

    proxy<E, M extends string>(e: E, msg?: M) {
      return (
        isKindError(e)
          ? e
          : proxyFn(name, msg || "", context)
      ) as KindError<TName, string, TContext>;
    },

    partial,
    rebase: partial,

    is(val: unknown): val is KindError<TName, string, TContext> {
      return isKindError(val) && val.kind === name;
    },

    toString() {
      return `KindErrorType::${pascalName}(${name})`;
    },

    toJSON() {
      return {
        __kind: "KindErrorType",
        kind: name,
        name: `${pascalName}ErrorType`,
        errorName: pascalName,
        type: asKindType(name),
        subType: asKindSubType(name),
        context,
      };
    },
  };

  const fn = <
    TMsg extends string,
    TCtx extends Record<string, unknown>,
  >(
    msg: TMsg,
    ctx?: TCtx,
  ) => {
    const mergedContext = {
      ...context,
      ...(ctx || {}),
    } as MergeObjects<TContext, TCtx>;

    const err = new Error(msg) as any;

    const stackTrace = getStackTrace();

    err.__kind = "KindError";
    err.kind = name;
    err.type = asKindType(name);
    err.subType = asKindSubType(name);
    err.name = pascalName;
    err.message = msg;
    err.stackTrace = () => stackTrace;
    err.stack = err.stack || "";
    err.context = mergedContext;

    err.toString = toStringFn(err);
    err.toJSON = toJsonFn(err);

    err[inspect.custom] = () => {
      return err.toString();
    };

    return err;
  };

  const namedFn = renameFunction(fn, `${pascalName}ErrorType`);

  return createFnWithProps(namedFn, props) as unknown as Rtn<TName, TContext>;
}
