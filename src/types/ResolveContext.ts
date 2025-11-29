import type {
  As,
  EmptyObject,
  ExpandDictionary,
  ExpandRecursively,
  IsEqual,
  IsUndefined,
  OptionalKeysTuple,
} from "inferred-types";

import type { DetectOptionalValues, NonVariants, Variants } from "~/types";

type UndefinedAreUndefined<
  T extends Record<string, unknown>,
  O extends readonly (keyof T & string)[] = As<
    OptionalKeysTuple<DetectOptionalValues<T>>,
    readonly (keyof T & string)[]
  >,
> = Record<O[number], undefined>;

/**
 * **ResolveContext**`<TSchema, TCtx>`
 *
 * Responsible for merging the context schema defined as part of the
 * `KindErrorType` with any context `TCtx` values provided when the `KindError`
 * was produced.
 */
export type ResolveContext<
  TSchema extends Record<string, unknown>,
  TCtx extends Record<string, unknown> | undefined,
  TNonVariants extends Record<string, unknown> = NonVariants<TSchema>,
  TVariants extends Record<string, unknown> = Variants<TSchema>,
> = As<
  IsUndefined<TCtx> extends true
    ? IsEqual<TSchema, Record<string, unknown>> extends true
      ? EmptyObject
      : ExpandRecursively<
            TNonVariants & UndefinedAreUndefined<TSchema>
      >
    : TCtx extends DetectOptionalValues<TVariants>
      ? IsEqual<TVariants, EmptyObject> extends true
        ? ExpandDictionary<TNonVariants & TCtx & {
          __warning: `context was supposed to be empty as defined by the schema but context was added anyway!`;
        }>
        : ExpandDictionary<TNonVariants & TCtx>
      : ExpandDictionary<TNonVariants & TCtx & {
        __warning: `The context provided for this error had properties which were inconsistent with the schema defined by the KindErrorType!`;
        __schema: TVariants;
        __ctx: TCtx;
      }>,
  Record<string, unknown>
>;
