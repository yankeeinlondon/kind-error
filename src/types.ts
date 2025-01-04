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

export interface DefineKindError<SafeKind extends string, TBaseContext extends Record<string,Narrowable>> {
  <
    TErrContext extends Record<string, C>,
    C extends Narrowable,
  >(msg: string, context: TErrContext): KindError<SafeKind, MergeObjects<TBaseContext, TErrContext>>;

  (msg: string): KindError<
    SafeKind, 
    IsEqual<TBaseContext, Record<string, Narrowable>> extends true
      ? EmptyObject
      : TBaseContext
  >;
}

/**
 * **KindError**
 *
 * An error generated via the `kindError()` runtime utility.
 */
export interface KindError<
  TKind extends string = string,
  TContext extends Dictionary<string, Narrowable> = Dictionary<string, Narrowable>
> extends Error {
  __kind: "KindError";
  name: PascalCase<TKind>;
  kind: KebabCase<TKind>;
  file?: string;
  line?: number;
  col?: number;
  context: TContext;
  stackTrace: StackFrame[];
}

export type PascalKind<T extends string> = PascalCase<
  StripChars<T, "<" | ">" | "[" | "]" | "(" | ")">
>;

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
> = DefineKindError<PascalKind<TKind>, TBase>

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
