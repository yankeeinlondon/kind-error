import type { FromInputToken__Tuple, InputTokenSuggestions } from "inferred-types";

/**
 * the array and tuple type definition of `SchemaApi`
 */
export interface SchemaApi__ArrayTuple {

  /**
   * **array**`(...types)`
   *
   * A wide array type where each element in the array represents an _allowed_ type in the
   * array. If not types are specified this will translate into `unknown[]`.
   */
  array: <const T extends readonly InputTokenSuggestions[]>(...members: T) => FromInputToken__Tuple<T>[number][];

  /**
   * **optArray**`(...types)`
   *
   * A wide array type where each element in the array represents an _allowed_ type in the
   * array. If not types are specified this will translate into `unknown[]`.
   */
  optArray: <const T extends readonly InputTokenSuggestions[]>(...members: T) => T[number][] | undefined;

  /**
   * **tuple**`(...elements)`
   *
   * Treats each element as a "token" for an element in the tuple.
   */
  tuple: <T extends readonly InputTokenSuggestions[]>(...elements: T) => FromInputToken__Tuple<T>;

  /**
   * **optTuple**`(...elements)`
   *
   * Treats each element as a "token" for an element in the tuple; converts into an
   * _optional_ tuple (e.g., `FromInputToken<T> | undefined`)
   */
  optTuple: <const T extends readonly InputTokenSuggestions[]>(...elements: T) => FromInputToken__Tuple<T> | undefined;
}
