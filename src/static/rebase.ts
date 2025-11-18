// TODO: remove this when ready; will be replaced with `partial` function

import type {
  MergeObjects,
  Narrowable,
} from "inferred-types/types";
import type { KindErrorType } from "~/types";
import {
  isEmpty,
  mergeObjects,
} from "inferred-types/runtime";
import { createKindError } from "~";

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
