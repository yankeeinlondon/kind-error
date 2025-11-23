import type { Dictionary, Narrowable } from "inferred-types";
import type { FetchError, JsError, KindError, KindErrorType, KindStackItem } from "../types";
import { parse } from "error-stack-parser-es/lite";
import { hasIndexOf, isObject, isString, isUndefined } from "inferred-types";
import { relative } from "pathe";
import { createKindError, isError } from "~";

const IGNORABLES = ["@vitest/runner", "node:", "native"];

/**
 * creates a structured stack trace (e.g., `KindStackTrace[]`)
 * from a normal error.
 */
export function createStackTrace<T extends JsError>(
  err: T,
): KindStackItem[] {
  return parse(err).slice(1).filter(
    i => !IGNORABLES.some(has => i.file && i.file.includes(has)),
  ).map(i => ({
    ...i,
    file: i.file ? relative(".", i.file) : undefined,
  }));
}

/**
 * Creates a `KindError` from another error
 */
export function errorFromError<
  TKind extends string,
  TCtx extends Record<string, N>,
  TErr extends JsError,
  N extends Narrowable,
>(
  kind: TKind,
  ctx: TCtx,
  err: TErr,
): any {
  const context = {
    ...ctx,
    underlying: err,
  } as any;

  const factory = createKindError(
    kind,
    context,
  ) as any;

  const error = factory(err.message);

  (error as any).cause = err;
  if (err.stack) {
    error.stackTrace = createStackTrace(err);
  }

  return error;
};

export function errorFromResponse<
  TKind extends string,
  TCtx extends Record<string, N>,
  TErr extends FetchError,
  N extends Narrowable,
>(
  kind: TKind,
  ctx: TCtx,
  res: TErr,
): any {
  const context = {
    ...ctx,
    underlying: res,
  } as any;

  const wrapper = createKindError(kind, context) as any;

  return wrapper((res as any).statusText);
}

export function getMessageInObject<
  T extends Dictionary,
>(
  obj: T,
  ...props: readonly string[]
) {
  let message: string | undefined;

  props.forEach((p) => {
    if (p in obj && isUndefined(message)) {
      if (isString(obj[p])) {
        message = obj[p];
      }
      else if (isError(obj[p])) {
        message = obj[p].message;
      }
    }
  });

  return message;
}

export function errorFromObject<
  TKind extends string,
  TCtx extends Record<string, N>,
  TObj extends Dictionary,
  N extends Narrowable,
>(
  kind: TKind,
  ctx: TCtx,
  obj: TObj,
): any {
  const message = getMessageInObject(
    obj,
    "message",
    "msg",
    "error",
    "cause",
    "reason",
    "err",
    "code",
  ) || `Unknown Condition`;

  const context = {
    ...ctx,
    underlying: obj,
  } as any;

  const error = createKindError(kind, context) as any;

  return error(message);
}

/**
 * proxies from an error being represented in an unknown
 * structure (as `Error`, `Response`, etc. have already
 * been tried)
 */
export function errorFromRest<
  TKind extends string,
  TCtx extends Record<string, N>,
  TRest,
  N extends Narrowable,
>(
  kind: TKind,
  ctx: TCtx,
  rest: TRest,
): any {
  const message = isString(rest)
    ? rest
    : isObject(rest)
      ? hasIndexOf(rest as any, "error") && typeof (rest as any).error === "string"
        ? (rest as any).error
        : hasIndexOf(rest as any, "msg") && typeof (rest as any).msg === "string"
          ? (rest as any).msg
          : hasIndexOf(rest as any, "message") && typeof (rest as any).message === "string"
            ? (rest as any).message
            : "Unknown"
      : "Unknown";

  const error = createKindError(
    kind,
    {
      ...ctx,
      underlying: rest,
    } as any,
  ) as any;

  return error(message as string);
}
