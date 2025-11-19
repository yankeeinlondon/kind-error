import type {
  EmptyObject,
  ExpandRecursively,
  PascalCase,
} from "inferred-types";
import type { AsKindSubType, AsKindType, KindStackItem } from "~/types";

/**
 * The basic _shape_ of a `KindError`
 */
export type KindErrorShape = {
  __kind: "KindError";
  kind: string;
  type: string;
  subType: string | undefined;
  message: string;
  stack?: string;
  stackTrace: KindStackItem[];
  context: Record<string, unknown>;
} & Error;

/**
 * **KindError**`<[TName],[TMsg],[TCtx]>`
 *
 * A `KindError`, which extends the Javascript `Error` type and
 * provides literal types where possible to describe the error.
 */
export type KindError<
  TName extends string = string,
  TMsg extends string = string,
  TCtx extends Record<string, unknown> = EmptyObject,
> = (
    {
      __kind: "KindError";
      name: PascalCase<AsKindType<TName>>;
      kind: TName;
      type: AsKindType<TName>;
      subType: AsKindSubType<TName>;
      message: TMsg;
      stack?: string;
      stackTrace: KindStackItem[];
      context: TCtx;

      toString: () => string;
    } & Error) extends infer KErr extends KindErrorShape
  ? KErr
  : never;
