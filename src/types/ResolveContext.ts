import type {
  As,
  EmptyObject,
  ExpandDictionary,
  Fallback,
  IsEqual,
  IsUndefined,
  Narrowable,
} from "inferred-types";

import type { AsContextShape, NonVariants } from "~/types";

/**
 * **ResolveContext**`<TSchema, TCtx>`
 *
 * Responsible for merging the context schema defined as part of the
 * `KindErrorType` with any context `TCtx` provided when the `KindError`
 * was produced.
 */
export type ResolveContext<
  TSchema extends Record<string, unknown>,
  TCtx extends Record<string, any> | undefined,
> = As<
  IsUndefined<TCtx> extends true
    ? IsEqual<TSchema, Record<string, unknown>> extends true
      ? EmptyObject
      : IsEqual<TSchema, EmptyObject> extends true
        ? EmptyObject
        : TSchema
    // TCtx is defined
    : IsEqual<TSchema, Record<string, unknown>> extends true
      ? Fallback<TCtx, EmptyObject>
      : IsEqual<TSchema, EmptyObject> extends true
        ? EmptyObject
        : AsContextShape<TSchema> extends infer ContextShape
          ? IsEqual<ContextShape, EmptyObject> extends true
            ? IsEqual<TCtx, EmptyObject> extends true
              ? EmptyObject
              : IsEqual<TCtx, undefined> extends true
                ? EmptyObject
                : TCtx extends Record<string, unknown>
                  ? ExpandDictionary<
                    NonVariants<TSchema>
                    & TCtx & Record<"__warning", `context was supposed to be empty as defined by the schema but context was added anyway!`>
                  >
                  : never
            : Fallback<TCtx, EmptyObject> extends ContextShape
              ? ExpandDictionary<
                    NonVariants<TSchema> & Fallback<TCtx, EmptyObject>
              >
              : ExpandDictionary<
                NonVariants<TSchema> & Fallback<TCtx, EmptyObject>
                & {
                  __warning: `The context provided for this error had properties which were inconsistent with the schema defined by the KindErrorType!`;
                  __schema: TSchema;
                }
              >
          : never,
  Record<string, unknown>
>;
