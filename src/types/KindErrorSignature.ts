import type { IsEqual } from "inferred-types";
import type {
  AsContextShape,
  HasRequiredVariants,
  KindError,
  ResolveContext,
} from "~/types";

/**
 * **KindErrorSignature**`<T>`
 *
 * Determines what the `KindErrorType`'s function signature
 * should look like. Variance is determined by the context
 * schema defined:
 *
 * - **No Schema**
 *     - when _no schema_ is defined in the `KindErrorType` we allow
 *       any key/value pairs to be added to context when instantiating
 *       to a `KindError`.
 * - **EmptyObject**
 *     - this implies that context is locked down and no properties are
 *       expected.
 *     - the function's only parameter will be the error message
 * - **No Variants**
 *     - if a error type defines one or more **static** / **non-variant**
 *       key/values these will be preserved and available in the final
 *       `KindError` but no other key/values are allowed when instantiating
 *     - the function's only parameter will be the error message
 * - **Required Variants**
 *     - If there are **variant** key/values defined in the schema, there
 *       will be a required `ctx` property added after message.
 * - **Optional Variants**
 *     - if all variant key/values defined in the schema are "optional"
 *       (aka, are a union type which includes `undefined`) then the
 *       `ctx` property will be added to the function signature but it
 *       will be optional.
 *
 * In all cases the _return type_ should be some form of a `KindError`.
 *
 * **Related:** `ResolveContext`
 */
export type KindErrorSignature<
  TName extends string,
  TSchema extends Record<string, unknown>,
> = IsEqual<TSchema, Record<string, unknown>> extends true
  ? <
      TMsg extends string,
      TCtx extends Record<string, unknown>,
    >(msg: TMsg,
      ctx?: TCtx) => KindError<
      TName,
      TMsg,
      ResolveContext<Record<string, unknown>, TCtx>
    >
  : HasRequiredVariants<TSchema> extends true
    ? <
        TMsg extends string,
        TCtx extends AsContextShape<TSchema>,
      >(msg: TMsg,
        ctx: TCtx) => KindError<
        TName,
        TMsg,
        ResolveContext<TSchema, TCtx>
      >
    : <
        TMsg extends string,
        TCtx extends AsContextShape<TSchema>,
      >(msg: TMsg,
        ctx?: TCtx) => KindError<
        TName,
        TMsg,
        ResolveContext<TSchema, TCtx>
      >;
