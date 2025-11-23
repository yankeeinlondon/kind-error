import type { Err, IsEqual, Scalar } from "inferred-types";
import type { RuntimeToken, RuntimeTokenCallback } from "~";

type FromScalar<T extends Scalar>
  = [IsEqual<T, null>] extends [true]
    ? RuntimeToken<"null">
    : [IsEqual<T, true>] extends [true]
        ? RuntimeToken<"true">
        : [IsEqual<T, false>] extends [true]
            ? RuntimeToken<"false">
            : [IsEqual<T, boolean>] extends [true]
                ? RuntimeToken<"boolean">
                : [IsEqual<T, undefined>] extends [true]
                    ? RuntimeToken<"undefined">
                    : [T] extends [string]
                        ? [string] extends [T]
                            ? RuntimeToken<"string">
                            : RuntimeToken<`string::${T}`>
                        : [T] extends [number]
                            ? number extends T
                              ? RuntimeToken<"number">
                              : RuntimeToken<`number::${T}`>
                            : [T] extends [bigint]
                                ? RuntimeToken<"bigint">
                                : never;

export type AsRuntimeToken<
  T extends Scalar | RuntimeToken | RuntimeTokenCallback,
> = [T] extends [RuntimeToken]
  ? T
  : [T] extends [RuntimeTokenCallback]
      ? ReturnType<T>
      : [T] extends [Scalar]
          ? FromScalar<T>
          : Err<
            `invalid-token`,
            `AsToken<T> received a type which is can not be converted to a .`
          >;
