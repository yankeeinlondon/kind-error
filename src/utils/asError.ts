import type {
  Mutable,
} from "inferred-types";
import {
  isDictionary,
  isString,
  Never,
} from "inferred-types";
import { isError } from "~/type-guards";

type Rtn<T> = T extends string
  ? Error & { message: T }
  : T extends Error
    ? T
    : T extends Record<string, unknown>
      ? Error & Mutable<T>
      : never;

/**
 * **asError**`(errLike)`
 *
 * Takes a string or object and converts it into an `Error` object.
 *
 * - if an `Error` is passed in that will be proxied through unchanged
 */
export function asError<const T extends string | Record<string, unknown> | Error>(errLike: T): Rtn<T> {
  if (isString(errLike)) {
    const err = new Error();
    err.message = errLike;
    return err as Rtn<T>;
  }
  else if (isError(errLike)) {
    return errLike as Rtn<T>;
  }
  else if (isDictionary(errLike)) {
    const err: any = new Error() as Error & T;
    const keys = Object.keys(errLike) as (string & keyof T)[];
    for (const k of keys) {
      // copy properties from the dictionary onto the Error instance
      err[k] = errLike[k];
    }

    return err as Rtn<T>;
  }

  return Never as Rtn<T>;
}
