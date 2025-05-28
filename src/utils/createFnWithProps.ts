import type { AnyObject, TypedFunction } from "inferred-types";

/**
 * **createFnWithPropsExplicit**`<F,P>(fn, props)`
 *
 * Creates a strongly typed function along with properties.
 *
 * - unlike the similar `createFnWithProps()`, this utility just
 * expects you to type the function and properties yourself.
 */
export function createFnWithPropsExplicit<
  TFn extends TypedFunction,
  TProps extends AnyObject,
>(fn: TFn, props: TProps) {
  const fnWithProps: any = fn;
  for (const prop of Object.keys(props)) {
    if (prop !== "name")
      fnWithProps[prop] = props[prop as keyof typeof props];
  }

  return fnWithProps as TFn & TProps;
}
