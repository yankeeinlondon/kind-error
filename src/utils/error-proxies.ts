import type { Dictionary, Narrowable } from "inferred-types";
import type { ErrorResponse, JsError, KindError, KindStackItem } from "../types";
import { parse } from "error-stack-parser-es/lite";
import { isString, isUndefined } from "inferred-types";
import { relative } from "pathe";
import { createKindError } from "src/kindError";
import { isError } from "src/type-guards/index";

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
): KindError<TKind, TCtx> {
  const context = {
    ...ctx,
    underlying: err,
  };

  const error = createKindError(
    kind,
    context,
  )(err.message) as unknown as KindError<TKind, TCtx>;

  error.cause = err;
  if (err.stack) {
    error.stackTrace = createStackTrace(err);
  }

  return error as KindError<TKind, TCtx>;
};

export function errorFromResponse<
  TKind extends string,
  TCtx extends Record<string, N>,
  TErr extends ErrorResponse,
  N extends Narrowable,
>(
  kind: TKind,
  ctx: TCtx,
  res: TErr,
) {
  const context = {
    ...ctx,
    underlying: res,
  };

  const wrapper = createKindError(kind, context);

  return wrapper(res.statusText);
}

function getMessageInObject<
  T extends Dictionary,
>(
  obj: T,
  ...props: readonly string[]
) {
  let message: string = "";

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
) {
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
  };

  const error = createKindError(kind, context);

  return error(message);
}

export function errorFromRest<
  TKind extends string,
  TCtx extends Record<string, N>,
  TRest extends Narrowable,
  N extends Narrowable,
>(
  kind: TKind,
  ctx: TCtx,
  rest: TRest,
) {
  const message = isString(rest) ? rest : "Unknown";

  const error = createKindError(
    kind,
    {
      ...ctx,
      underlying: rest,
    },
  );

  return error(message);
}
