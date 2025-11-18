import { 
    Dictionary, 
    EmptyObject,  
    ExpandRecursively, 
    IsDefined, 
    IsEqual, 
    MergeObjects 
} from "inferred-types";
import { 
    KindError,
    AsContext, 
    AsKindSubType, 
    AsKindType, 
    HasRequiredVariants,
    ErrorResponse, 
    KindErrorName
} from "~/types";

/**
 * Determines the appropriate function signature for the KindErrorType's 
 * function call. Variance is determined by the number of required and 
 * optional parameter defined in the context/schema of the error type.
 */
export type KindErrorSignature<
    TName extends string,
    TContext extends Dictionary<string>
> = HasRequiredVariants<TContext> extends true
? <TMsg extends string, TCtx extends AsContext<TContext>>(msg: TMsg, ctx: TCtx) => (
    KindError<TName, TMsg> & { context: MergeObjects<TContext,TCtx>; message: TMsg }
)
: IsEqual<AsContext<TContext>, EmptyObject> extends true
    ? <TMsg extends string>(msg: TMsg) => (
        KindError<TName> & { context: TContext, message: TMsg }
    )
    : <TMsg extends string, TCtx extends AsContext<TContext>>(msg: TMsg, ctx?: TCtx) => (
    KindError<TName> & { 
        context: IsDefined<TCtx> extends true? MergeObjects<TContext,TCtx> : TContext; 
        message: TMsg 
    }
);

/**
 * **KindErrorType**`<TName,TContext>`
 * 
 * Defines an error type, exposing:
 *   - some key/value metadata properties
 *   - access to the `proxy()` and `partial()` modifiers
 *   - at the root it is a function which will convert
 *     this error type _into_ an actual `KindError`.
 */
export type KindErrorType<
    TName extends string,
    TContext extends Dictionary<string> = Dictionary<string>
> = {
    /** unique identifier of a `KindErrorType` */
    __kind: "KindErrorType";

    /** the _kind_ of the resultant KindError */
    kind: TName
    /**
     * the `type` of the error
     */
    type: AsKindType<TName>;
    /**
     * the `subType` of the error (if present)
     */
    subType: AsKindSubType<TName>;

    /** the error's name when instantiated */
    errorName: KindErrorName<TName>;
    /**
     * the shape of the error's context properties
     */
    context: TContext;

    /**
     * **proxy**`(err, [fallback msg]) -> KindError`
     * 
     * Allows you to proxy an error or error-like variable:
     * 
     * - if this error passed in is _already_ a `KindError` then it will
     * be passed through "as is"
     * - however, if the `err` passed in is not a `KindError` then this will
     *   return a `KindError` of this type:
     *      - a property `underlying` will be added and `err` will be placed here
     *      - if `err` has a "message" or a stringified version of itself then this
     *        will be placed in the error's `message` property
     *      - if `err` is a key/value object and has an overlapping property with
     *        the schema for this error type, AND the type is consistent with this
     *        error type's schema then it will be set accordingly.
     */
    proxy: <E, M extends string | undefined>(err: E, msg?: M) => E extends KindError
        ? E
        : ExpandRecursively<
            KindError<TName> & Record<"underlying", Error | Dictionary | ErrorResponse>
        > & Error;

    /**
     * **partial**`(context) -> KindErrorType`
     * 
     * Allows you to add _some_ (or _all_) of the schema properties for the defined error.
     * - this will return another `KindErrorType` with the same name but with less context
     * properties to set at instantiation (because these context parameters have now been
     * set and made static)
     */
    partial: <T extends Partial<AsContext<TContext>>>(context: T) => KindErrorType<TName,TContext>

    /**
     * **is**`(val): val is KindError<TName, string, TContext>`
     * 
     * A type guard which validates the error type's 
     */
    is(val: unknown): val is KindError<TName, string, TContext>;

    toString(): string;

} & KindErrorSignature<TName,TContext>;
