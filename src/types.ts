import {
  PascalCase,
  KebabCase,
  Narrowable,
  MergeObjects,
  StripChars,
  Dictionary,
} from "inferred-types/types";
import { StackFrame } from "error-stack-parser-es";

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
  kind: KebabCase<StripChars<TKind, "<" | ">" | "[" | "]" | "(" | ")">>;
  file?: string;
  line?: number;
  col?: number;
  context: TContext;
  stackTrace: StackFrame[];
}

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
) => KindError<TKind, MergeObjects<TBase, TContext>>;
