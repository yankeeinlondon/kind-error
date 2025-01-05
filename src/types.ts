import type { StackFrame } from "error-stack-parser-es";
import type {
  Dictionary,
  EmptyObject,
  IsEqual,
  KebabCase,
  MergeObjects,
  Narrowable,
  PascalCase,
  StripChars,
} from "inferred-types";

export type PascalKind<T extends string> = PascalCase<
  StripChars<T, "<" | ">" | "[" | "]" | "(" | ")">
>;

export type KebabKind<T extends string> = KebabCase<
  StripChars<T, "<" | ">" | "[" | "]" | "(" | ")">
>;

export interface DefineKindError<
  SafeKind extends string,
  TBaseContext extends Record<string, Narrowable>,
> {
  <TErrContext extends Record<string, C>, C extends Narrowable>(
    msg: string,
    context: TErrContext,
  ): KindError<SafeKind, MergeObjects<TBaseContext, TErrContext>>;

  (
    msg: string,
  ): KindError<
    SafeKind,
    IsEqual<TBaseContext, Record<string, Narrowable>> extends true
      ? EmptyObject
      : TBaseContext
  >;
}

export interface BaseKindError extends Error {
  readonly __kind: "KindError";
  readonly __errorType: unique symbol;
  name: string;
  kind: string;
  /** file name (if available) */
  file?: string;
  /** line number (if available) */
  line?: number;
  /** column (if available) */
  col?: number;
  /** function name (if available) */
  fn?: string;
  context: Dictionary<string, Narrowable>;
  stackTrace: StackFrame[];
  /**
   * returns a well formatted and colored output intended for the
   * terminal.
   */
  asConsoleMessage: () => string;
  /**
   * An array of messages which can be pushed to the browser's
   * console to represent the error.
   */
  asBrowserMessages: () => unknown[];
}

/**
 * **KindError**
 *
 * An error generated via the `kindError()` runtime utility.
 */
export type KindError<TKind, TContext> = TKind extends string
  ? TContext extends Dictionary<string, Narrowable>
    ? BaseKindError & {
      name: PascalKind<TKind>;
      kind: KebabKind<TKind>;
      context: TContext;
    }
    : never
  : never;

export type DefaultKindError = BaseKindError;

export interface KindErrorType__Props<
  TKind extends string,
  TBase extends Dictionary<string, Narrowable>,
> {
  readonly __kind: "KindErrorType";
  /** the _kind_ of the resultant KindError */
  kind: KebabKind<TKind>;

  /** the _type_ of the resulting error */
  errorType: KindError<TKind, TBase>;

  /**
   * Allows the addition of context key/value pairs before using it
   * to create a `KindError`.
   */
  rebase: <T extends Dictionary<string, N>, N extends Narrowable>(
    context: T,
  ) => KindErrorType<TKind, MergeObjects<TBase, T>>;
  /**
   * **proxy(err)**
   *
   * Receives an error and if it's a `KindError` it will simply pass it through, if it is
   * _not_ a `KindError` it will add the `underlying` property to context and place the
   * error there as well as adopt that error's message property.
   */
  proxy: <E extends Error>(err: E) => E extends BaseKindError ? E : KindError<TKind, TBase & Record<"underlying", E>>;

  /**
   * Type guard for this particular _kind_ of `KindError`
   */
  is: (val: unknown) => val is KindError<TKind, TBase>;
}

export type KindErrorType__Fn<
  TKind extends string,
  TBase extends Dictionary<string, Narrowable>,
> = DefineKindError<PascalKind<TKind>, TBase>;

/**
 * **KindErrorType**`<K,C>`
 *
 * A definition for a `KindError`.
 *
 * - call this function to turn it into a `KindError` as specified by this definition.
 * - call `.rebase(context)` to provide additional context key/values prior to using it.
 */
export type KindErrorType<
  TKind extends string,
  TBase extends Dictionary<string, Narrowable>,
> = KindErrorType__Fn<TKind, TBase> &
KindErrorType__Props<TKind, TBase>;
