import type { Suggest } from "inferred-types";

/**
 * the string-based type definition of `SchemaApi`
 */
export interface SchemaApi__String {

  /**
   * **string**`(...literals)`
   *
   * a wide string (with no params), a string literal (with one param), or a string literal union
   * (with multiple params).
   */
  string: <T extends readonly string[]>(...literals: T) => [] extends T ? string : T[number];

  /**
   * **optString**`(...literals)`
   *
   * an _optional_ wide string (with no params), an _optional_ string literal (with one param),
   * or an _optional_ string literal union (with multiple params).
   */
  optString: <T extends readonly string[]>(...literals: T) => [] extends T ? string | undefined : T[number] | undefined;

  /**
   * **startsWith**`<T>(...literals: T) => StartsWithDistribute<T[number]>`
   *
   * defines a string literal which is defined to _start with_ any of the literals
   * you pass in.
   */
  startsWith: <T extends readonly string[]>(...literals: T) => `${T[number]}${string}`;

  /**
   * **endsWith**`<T>(...literals: T) => EndsWithDistribute<T[number]>`
   *
   * defines a string literal which is defined to _end with_ any of the literals
   * you pass in.
   */
  endsWith: <T extends readonly string[]>(...literals: T) => `${string}${T[number]}`;

  /**
   * **suggest**`(...suggestions)`
   *
   * An array of of string-based suggestions. The type will "suggest" the suggestions but _any_ string
   * type will match the type.
   */
  suggest: <T extends readonly string[]>(...literals: T) => [] extends T ? string : Suggest<T[number]>;
}
