import type {
  Dictionary,
  ExpandRecursively,
  MergeObjects,
} from "inferred-types";
import type { KindErrorSignature } from "./KindErrorSignature";
import type {
  AsContextShape,
  AsKindSubType,
  AsKindType,
  FetchError,
  KindError,
  KindErrorName,
  ResolveContext,
} from "~/types";

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
  TName extends string = string,
  TContext extends Record<string, unknown> = Record<string, unknown>,
> = {
  /** unique identifier of a `KindErrorType` */
  __kind: "KindErrorType";

  /** the _kind_ of the resultant KindError */
  kind: TName;
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
            KindError<TName> & Record<"underlying", Error | Dictionary | FetchError>
    > & Error;

  /**
   * **partial**`(context) -> KindErrorType`
   *
   * Allows you to add _some_ (or _all_) of the schema properties for the defined error.
   * - this will return another `KindErrorType` with the same name but with less context
   * properties to set at instantiation (because these context parameters have now been
   * set and made static)
   */
  partial: <T extends Partial<AsContextShape<TContext>>>(
    context: T,
  ) => KindErrorType<TName, ResolveContext<TContext, T>>;

  /**
   * **rebase**`(context) -> KindErrorType`
   * 
   * An alias for `partial`.
   */
  rebase: <T extends Partial<AsContextShape<TContext>>>(
    context: T,
  ) => KindErrorType<TName, ResolveContext<TContext, T>>;

  /**
   * **is**`(val): val is KindError<TName, string, TContext>`
   *
   * A type guard which validates the error type's
   */
  is: (
    val: unknown,
  ) => val is KindError<TName, string, ResolveContext<TContext, undefined>>;

  toString: () => string;

} & KindErrorSignature<TName, TContext>;
