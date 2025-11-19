import type { Contains, EmptyObject, Err, MergeObjects } from "inferred-types";
import type { AsContextShape, KindError, KindErrorType, KindStackItem, ResolveContext } from "~/types";
import { inspect } from "node:util";
import {
  createFnWithProps,
  err,
  isError,
  isObject,
  isString,
  toPascalCase,
} from "inferred-types";
import { asKindSubType, asKindType, createStackTrace, getMessageInObject, getStackTrace, renameFunction } from "~/utils";
import { toJsonFn, toStringFn } from "./instance";
import { isKindError } from "./type-guards";

type Rtn<
  TName extends string,
  TContext extends Record<string, unknown>,
> = Contains<TName, "<" | ">" | "[" | "]" | "(" | ")"> extends true
  ? Err<
    "invalid-name",
    `The name for a KindError must not include any of the following characters: "<", ">", "[", "]", "(", ")"`
  >
  : KindErrorType<TName, TContext>;

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

  const props = {
    __kind: "KindErrorType",
    kind: name,
    errorName: pascalName,
    type: asKindType(name),
    subType: asKindSubType(name),
    context,

    proxy<E, P extends AsContextShape<TContext>>(
      e: E,
      ...args: [props?: P]
    ) {
      const props = args[0];
      if (isKindError(e)) {
        return e as unknown as KindError<TName, string, ResolveContext<TContext, P>> & Record<"underlying", E>;
      }

      let msg = "Unknown Error";
      let stack: KindStackItem[] | undefined;

      if (isError(e)) {
        msg = e.message;
        if (e.stack) {
          stack = createStackTrace(e);
        }
      }
      else if (isObject(e)) {
        msg = getMessageInObject(e, "message", "msg", "error", "cause", "reason", "err", "code") || "Unknown Error";
      }
      else if (isString(e)) {
        msg = e;
      }

      const mergedProps = {
        ...(props || {}),
        underlying: e,
      };

      const err = fn(msg, mergedProps);

      if (stack) {
        err.stackTrace = () => stack!;
      }

      return err as unknown as KindError<TName, string, ResolveContext<TContext, P>> & Record<"underlying", E>;
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

  const namedFn = renameFunction(fn, `${pascalName}ErrorType`);

  return createFnWithProps(namedFn, props) as unknown as Rtn<TName, TContext>;
}
