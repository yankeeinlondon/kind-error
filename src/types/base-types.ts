import type {
  Contains,
  Dictionary,
  MergeObjects,
  Narrowable,
  TypedFunction,
} from "inferred-types";
import type { inspect } from "node:util";
import type {
  FetchError,
  KindErrorName,
  KindErrorSubTypeProp,
  KindErrorSymbol,
  KindErrorTypeName,
  KindErrorTypeProp,
  KindStackItem,
} from ".";

/**
 * The _properties_ required for a `KindErrorType` type
 */
export type KindErrorType__Props<
  TKind extends string,
  TBase extends Dictionary<string, unknown>,
> = {
  [KindErrorSymbol]: "KindErrorType";
  /** the _kind_ of the resultant KindError */
  kind: KindErrorKind<TKind> extends string
    ? KindErrorKind<TKind>
    : never;
  /** the "name" the resulting errors will have */
  errorName: KindErrorName<TKind> extends string
    ? KindErrorName<TKind>
    : never;

  type: string;
  subType: Contains<TKind, "/"> extends true ? string : undefined;

  context: TBase;

  /**
   * Allows the addition of context key/value pairs before using it
   * to create a `KindError`.
   */
  rebase: <
    T extends Dictionary<string, N>,
    N extends Narrowable,
  >(
    context: T,
  ) => KindErrorType<
    KindErrorTypeName<TKind>,
    MergeObjects<
      TBase,
      T
    >
  >;

  /**
   * **proxy(err)**
   *
   * Receives an error and if it's a `KindError` it will simply pass it through, if it is
   * _not_ a `KindError` it will add the `underlying` property to context and place the
   * error there as well as adopt that error's message property.
   *
   * Beyond `Error`'s you can also proxy through:
   *
   * - `Object Proxy` - any key/value object can be passed in and it will be treated in
   * similar fashion to how an error would be. The error's message property will be set
   * via the first of the following properties found to be set:
   *    - `[ "message", "msg", "cause", "error", "err"  ]`
   *
   */
  proxy: <E>(err: E) => E extends KindError
    ? E
    : KindError<
      TKind,
      TBase & Record<
        "underlying",
        Error | Dictionary | FetchError
      >
    >;

  /**
   * Type guard for this particular _kind_ of `KindError`
   */
  is: (val: unknown) => val is KindError<TKind, TBase>;

  toJSON: () => string;
} & Record<string, Narrowable>;

export type Stringifyable = string | boolean | number | null | Dictionary | Array<any> | Date;

/**
 * **KindErrorType**`<K,C>`
 *
 * A definition for a `KindError`.
 *
 * - call this function to turn it into a `KindError` as specified by this definition.
 * - call `.rebase(context)` to provide additional context key/values prior to using it.
 */
type KindErrorType<
  TKind extends string = string,
  TCtx extends Record<string, unknown> = Record<string, unknown>,
> = KindErrorType__Fn<TKind, TCtx>
  & KindErrorType__Props<TKind, TCtx>;

/**
 * **KindError**
 *
 * An error generated via the `kindError()` runtime utility.
 */
type KindError<
  TKind extends string = string,
  TContext extends Dictionary<string, Narrowable> = Dictionary<string, Narrowable>,
> = {
  [KindErrorSymbol]: "KindError";
  /** the error message */
  message: string;

  cause?: Error;

  /** a PascalCase representation of the error  */
  name: KindErrorName<TKind> & string;
  /** a KebabCase representation of the error's name */
  kind: KindErrorKind<TKind> & string;

  /**
   * The _primary_ type or category for the error
   */
  type: KindErrorTypeProp<TKind> & string;
  /**
   * The _secondary_ type or category for the error
   */
  subType: KindErrorSubTypeProp<TKind>;

  context: TContext;

  /** the file which raised the error */
  file?: string;
  /** the line number of the file which raised the error */
  line?: number;
  /** the column where the error was raised */
  col?: number;
  /**
   * the function name which was being executed when
   * the error was raised.
   */
  fn?: string;

  /**
   * Call to get a structured stack track array.
   */
  stackTrace: () => KindStackItem[];

  toString: () => string;
  toJSON: () => Record<string, unknown>;
  [inspect.custom]: TypedFunction;
  asBrowserMessage: () => readonly unknown[];
} & Error;

export type KindErrorType__Fn<
  TKind extends string,
  TBaseContext extends Record<string, unknown>,
> = <TErrContext extends Record<string, C>, C extends Narrowable>(
  msg: string,
  context?: TErrContext,
) => KindError<TKind, MergeObjects<TBaseContext, TErrContext>>;
