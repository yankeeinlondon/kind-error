import { describe, it } from "vitest";
import {
    AssertFalse,
    Expect,
    Test,
} from "inferred-types/types";
import { IsVariant } from "~";
import { AssertTrue } from "inferred-types";

describe("IsVariant<T>", () => {

    it("wide tokens", () => {
        type T1 = IsVariant<string>;
        type T2 = IsVariant<number>;
        type T3 = IsVariant<boolean>;

        type cases = [
            Expect<AssertTrue<T1>>,
            Expect<AssertTrue<T2>>,
            Expect<AssertTrue<T3>>,
        ];
    });

    
    it("literal tokens", () => {
        type F1 = IsVariant<`"foo"`>;
        type F1b = IsVariant<"foo">;
        type F2 = IsVariant<`42`>;
        type F3 = IsVariant<`null`>;
        type F4 = IsVariant<42>;
    
        type cases = [
            Expect<AssertFalse<F1>>,
            Expect<AssertFalse<F1b>>,
            Expect<AssertFalse<F2>>,
            Expect<AssertFalse<F3>>,
            Expect<AssertFalse<F4>>,
        ];
    });


    
    it("union tokens", () => {
        type T1 = IsVariant<`"foo" | "bar"`>;
        type T2 = IsVariant<`"foo" | 42`>;
        type T3 = IsVariant<42 | undefined>;
    
        type cases = [
            Expect<AssertTrue<T1>>,
            Expect<AssertTrue<T2>>,
            Expect<AssertTrue<T3>>,
        ];
    });

    
    it("non-token literal", () => {
        type F1 = IsVariant<"foo">;
        type F2 = IsVariant<42>;
    
        type cases = [
            Expect<AssertFalse<F1>>,
            Expect<AssertFalse<F2>>,
        ];
    });
    

    

});
