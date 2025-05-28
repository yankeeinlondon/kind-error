import type {
  MergeObjects,
  Narrowable,
} from "inferred-types";
import type { KindErrorType } from "src/types";
import {
  isEmpty,
  mergeObjects,
} from "inferred-types";
import { createKindError } from "src/kindError";

export function rebaseFn<
  TKind extends string,
  TBase extends Record<string, N>,
  N extends Narrowable,
>(
  kind: TKind,
  baseContext: TBase,
) {
  return <
    TCtx extends Record<string, N>,
    N extends Narrowable,
  >(context: TCtx) => {
    const merged = isEmpty(context)
      ? baseContext || {}
      : mergeObjects(baseContext, context) || {};

    return createKindError(
      kind,
      merged,
    ) as unknown as KindErrorType<
      TKind,
      MergeObjects<TBase, TCtx>
    >;
  };
}
