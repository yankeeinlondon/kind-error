import { 
    As, 
    Dictionary, 
    EmptyObject, 
    ExpandDictionary, 
    Fallback, 
    IsEqual, 
    IsUndefined 
} from "inferred-types";
import { AsContextShape, NonVariants } from "~/types";

/**
 * **ResolveContext**`<TSchema, TCtx>`
 * 
 * Responsible for merging the context schema defined as part of the
 * `KindErrorType` with any context `TCtx` provided when the `KindError`
 * was produced.
 */
export type ResolveContext<
    TSchema extends Record<string, unknown>,
    TCtx extends Record<string, unknown> | undefined
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
    : IsEqual<AsContextShape<TSchema>, EmptyObject> extends true
        ? IsEqual<TCtx,EmptyObject> extends true
            ? EmptyObject
        : IsEqual<TCtx, undefined> extends true
            ? EmptyObject
        : TCtx extends Record<string, unknown>
            ? ExpandDictionary<
                NonVariants<TSchema> & 
                TCtx & Record<"__warning", `context was supposed to be empty as defined by the schema but context was added anyway!`>
            >
        : never
    : Fallback<TCtx, EmptyObject> extends AsContextShape<TSchema>
        ? ExpandDictionary<
            NonVariants<TSchema> & Fallback<TCtx, EmptyObject>
        >
        : ExpandDictionary<
            NonVariants<TSchema> & Fallback<TCtx, EmptyObject> & 
            {
                "__warning": `The context provided for this error had properties which were inconsistent with the schema defined by the KindErrorType!`,
                "__schema": TSchema
            }>,
    Record<string, unknown>
>;
