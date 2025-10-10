import type {
  Concat,
  Contains,
  Dictionary,
  Join,
  KebabCase,
  MergeObjects,
  Narrowable,
  PascalCase,
  Split,
  StripChars,
  TypedFunction,
} from "inferred-types";
import type { inspect } from "node:util";

export const KindErrorSymbol = "__kind";

export type PascalKind<T extends string> = PascalCase<
  StripChars<T, "<" | ">" | "[" | "]" | "(" | ")">
>;

export type Stringifiable = string | boolean | number | null | Dictionary | Array<any> | Date;

export type PascalName<
  T extends readonly string[],
> = {
  [K in keyof T]: PascalKind<T[K]>
};

export type KebabKind<T extends string> = KebabCase<
  StripChars<T, "<" | ">" | "[" | "]" | "(" | ")">
>;

type KebabEach<T extends readonly string[]> = {
  [K in keyof T]: KebabKind<T[K]>
};

/**
 * a type utility which produces the _type_ for the `name` property
 * of a `KindErrorType`'s constructor function.
 */
export type KindErrorTypeName<
  T extends string,
> = PascalName<Split<T, "/">> extends readonly string[]
  ? Concat<[...PascalName<Split<T, "/">>, "ErrorType"]>
  : never;

export type KindErrorName<
  T extends string,
> = PascalName<Split<T, "/">> extends readonly string[]
  ? Concat<PascalName<Split<T, "/">>>
  : never;

export type KindErrorKind<T extends string> = KebabEach<Split<T, "/">> extends readonly string[]
  ? Join<
    KebabEach<Split<T, "/">>,
    "/"
  >
  : never;

/**
 * a type utility which produces the _type_ for the `type` property
 * of a `KindError`.
 */
export type KindErrorTypeProp<
  T extends string,
> = string extends T
  ? string
  : Split<T, "/"> extends readonly string[]
    ? KebabCase<Split<T, "/">[0]>
    : never;

/**
 * a type utility which produces the _type_ for the `type` property
 * of a `KindError`.
 */
export type KindErrorSubTypeProp<
  T extends string,
> = string extends T
  ? string
  : Split<T, "/"> extends readonly string[]
    ? Split<T, "/">[1] extends string
      ? KebabCase<Split<T, "/">[1]>
      : undefined
    : never;

export interface KindStackItem {
  file: string | undefined;
  function?: string;
  args?: any[];
  col?: number;
  line?: number;
  raw?: string;
}

/**
 * A Base Javascript Error
 */
export type JsError = Error & {
  name: string;
  message: string;
  stack?: string;

  toString: () => string;
};

/**
 * an _unsuccessful_ response from the native **fetch** method.
 */
export type ErrorResponse = Response & {
  ok: false;
};

export type SuccessfulReponse = Response & {
  ok: true;
};

/**
 * **KindError**
 *
 * An error generated via the `kindError()` runtime utility.
 */
export type KindError<
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
  TBaseContext extends Record<string, Narrowable>,
> = <TErrContext extends Record<string, C>, C extends Narrowable>(
  msg: string,
  context?: TErrContext,
) => KindError<TKind, MergeObjects<TBaseContext, TErrContext>>;

/**
 * The _properties_ required for a `KindErrorType` type
 */
export type KindErrorType__Props<
  TKind extends string,
  TBase extends Dictionary<string, Narrowable>,
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
                Error | Dictionary | ErrorResponse
      >
    >;

  /**
   * Type guard for this particular _kind_ of `KindError`
   */
  is: (val: unknown) => val is KindError<TKind, TBase>;

  toJSON: () => string;
} & Record<string, Narrowable>;

/**
 * **KindErrorType**`<K,C>`
 *
 * A definition for a `KindError`.
 *
 * - call this function to turn it into a `KindError` as specified by this definition.
 * - call `.rebase(context)` to provide additional context key/values prior to using it.
 */
export type KindErrorType<
  TKind extends string = string,
  TBase extends Dictionary<string, Narrowable> = Dictionary<string, Narrowable>,
>
  = KindErrorType__Fn<TKind, TBase>
  & KindErrorType__Props<TKind, TBase>;
