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
  file?: string;
  line?: number;
  col?: number;
  context: Dictionary<string, Narrowable>;
  stackTrace: StackFrame[];
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
      kind: TKind;
      context: TContext;
    }
    : never
  : never;

export type DefaultKindError = BaseKindError;

export type InferKindErrorType<T> = T extends {
  kind: infer K;
  context: infer C;
}
  ? [K, C]
  : never;

export type MakeKindError<T extends [string, Record<string, Narrowable>]> =
  KindError<T[0], T[1]>;

export interface KindErrorType__Props<
  TKind extends string,
  TBase extends Dictionary<string, Narrowable>,
> {
  rebase: <T extends Dictionary<string, N>, N extends Narrowable>(
    context: T,
  ) => KindErrorType<TKind, MergeObjects<TBase, T>>;
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
KindErrorType__Props<TKind, TBase> & { kind: "KindErrorType" };
