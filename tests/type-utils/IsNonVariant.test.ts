import { describe, it } from "vitest";
import {
    AssertFalse,
    Expect,
    Test,
} from "inferred-types/types";
import { IsNonVariant } from "~";
import { AssertTrue } from "inferred-types";

describe("IsNonVariant<T>", () => {

    it("wide tokens", () => {
        type F1 = IsNonVariant<string>;
        type F2 = IsNonVariant<number>;
        type F3 = IsNonVariant<boolean>;

        type cases = [
            Expect<AssertFalse<F1>>,
            Expect<AssertFalse<F2>>,
            Expect<AssertFalse<F3>>,
        ];
    });

    
    it("literal tokens", () => {
        type T1 = IsNonVariant<`"foo"`>;
        type T1b = IsNonVariant<"foo">;
        type T2 = IsNonVariant<`42`>;
        type T3 = IsNonVariant<`null`>;
    
        type cases = [
            Expect<AssertTrue<T1>>,
            Expect<AssertTrue<T1b>>,
            Expect<AssertTrue<T2>>,
            Expect<AssertTrue<T3>>,
        ];
    });


    
    it("union tokens", () => {
        type F1 = IsNonVariant<`"foo" | "bar"`>;
        type F2 = IsNonVariant<`"foo" | 42`>;
    
        type cases = [
            Expect<AssertFalse<F1>>,
            Expect<AssertFalse<F2>>,
        ];
    });

    
    it("non-token literal", () => {
        type T1 = IsNonVariant<"foo">;
        type T2 = IsNonVariant<42>;
    
        type cases = [
            Expect<AssertTrue<T1>>,
            Expect<AssertTrue<T2>>,
        ];
    });
    

    

});
