import type { StackFrame } from "error-stack-parser-es";
import type {
  Dictionary,
  KebabCase,
  MergeObjects,
  Narrowable,
  PascalCase,
  StripChars,
} from "inferred-types/types";

/**
 * **KindError**
 *
 * An error generated via the `kindError()` runtime utility.
 */
export interface KindError<
  TKind extends string,
  TContext extends Dictionary<string, Narrowable>,
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

export type PascalKind<T extends string> = PascalCase<StripChars<T, "<" | ">" | "[" | "]" | "(" | ")">>;

/**
 * **KindErrorDefn**`<K,C>`
 *
 * A definition for a `KindError`. Simply call this function to
 * turn it into a `KindError` as specified by this definition.
 */
export type KindErrorDefn<
  TKind extends string,
  TBase extends Dictionary<string, BC>,
  BC extends Narrowable = Narrowable,
> = <TContext extends Record<string, C>, C extends Narrowable>(
  msg: string,
  context?: TContext,
) => KindError<PascalKind<TKind>, MergeObjects<TBase, TContext>>;
