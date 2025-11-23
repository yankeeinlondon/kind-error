import { describe, it } from "vitest";
import {
    Expect,
    AssertEqual,
    DoesExtend,
    AssertTrue,
} from "inferred-types";
import { AsRuntimeToken } from "~/types/AsRuntimeToken";
import { RuntimeToken, RuntimeTokenCallback } from "~";

describe("AsRuntimeToken<T>", () => {

    it("scalar", () => {
        type T1 = AsRuntimeToken<null>;
        type T2 = AsRuntimeToken<"foo">;
        type T3 = AsRuntimeToken<true>;
        type T4 = AsRuntimeToken<false>;
        type T5 = AsRuntimeToken<boolean>;
        type T6 = AsRuntimeToken<42>;
        type T7 = AsRuntimeToken<number>;
        type T8 = AsRuntimeToken<bigint>;

        type cases = [
            Expect<AssertEqual<T1, RuntimeToken<"null">>>,
            Expect<AssertEqual<T2, RuntimeToken<"string::foo">>>,
            Expect<AssertEqual<T3, RuntimeToken<"true">>>,
            Expect<AssertEqual<T4, RuntimeToken<"false">>>,
            Expect<AssertEqual<T5, RuntimeToken<"boolean">>>,
            Expect<AssertEqual<T6, RuntimeToken<"number::42">>>,
            Expect<AssertEqual<T7, RuntimeToken<"number">>>,
            Expect<AssertEqual<T8, RuntimeToken<"bigint">>>,
        ];
    });


    
    it("RuntimeTokenCallback", () => {
        type MyCallback = (() => RuntimeToken<"string">) & { kind: "RuntimeToken" };

        type PreReq = DoesExtend<
            MyCallback, 
            RuntimeTokenCallback
        >;

        type T = AsRuntimeToken<MyCallback>;
    
        type cases = [
            Expect<AssertTrue<PreReq>>,
            Expect<AssertEqual<T, RuntimeToken<"string">>>,
        ];
    });

    
    it("RuntimeToken<T> proxies back type", () => {
    
        type cases = [
            Expect<AssertEqual<
                AsRuntimeToken<RuntimeToken<"string">>, RuntimeToken<"string">
            >>
        ];
    });
    
    

});
