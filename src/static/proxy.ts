import type { Dictionary, Narrowable } from "inferred-types";
import type { ErrorResponse, KindErrorType__Props } from "src/types";
import { isObject } from "inferred-types";
import { isError, isErrorResponse, isKindError } from "src/type-guards";
import { errorFromError, errorFromObject, errorFromResponse, errorFromRest } from "src/utils/error-proxies";

/**
 * Higher order function which produces the `proxy` method
 * as a way to proxy another error through a defined `KindErrorType`.
 */
export function proxyFn<
  TKind extends string,
  TKindName extends string,
  TBase extends Record<string, BC>,
  BC extends Narrowable,
>(
  kind: TKind,
  name: TKindName,
  context: TBase,
) {
  return <E extends Error | Dictionary | ErrorResponse>(
    err: E,
  ) => {
    const error = isKindError(err)
      ? err
      : isError(err)
        ? errorFromError(kind, context, err)
        : isErrorResponse(err)
          ? errorFromResponse(name, context, err)
          : isObject(err)
            ? errorFromObject(name, context, err)
            : errorFromRest(name, context, err);
    return error as unknown as ReturnType<KindErrorType__Props<
      TKind,
            TBase & Record<"underlying", E>
    >["proxy"]>;
  };
}
