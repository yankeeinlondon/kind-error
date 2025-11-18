import type { Narrowable } from "inferred-types/types";
import type { KindErrorType__Props } from "~/types";
import { isObject } from "inferred-types/runtime";
import { isError, isFetchError, isKindError } from "~/type-guards";
import { errorFromError, errorFromObject, errorFromResponse, errorFromRest } from "~/utils/error-proxies";

// TODO: refactor for new types

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
  return <E>(
    err: E,
  ) => {
    const error = isKindError(err)
      ? err
      : isError(err)
        ? errorFromError(kind, context, err)
        : isFetchError(err)
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
