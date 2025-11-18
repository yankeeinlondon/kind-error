import type {
  Concat,
  Contains,
  Dictionary,
  Join,
  KebabCase,
  MergeObjects,
  Narrowable,
  Split,
} from "inferred-types/types";
import { KindErrorType } from "./base-types";

export const KindErrorSymbol = "__kind";



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

export type SuccessfulResponse = Response & {
  ok: true;
};
