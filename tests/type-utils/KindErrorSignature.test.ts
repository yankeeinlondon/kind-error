import { describe, it } from "vitest";
import {
    Expect,
    Test,
} from "inferred-types/types";
import { AssertEqual, AssertExtends } from "inferred-types";
import {  KindError, KindErrorSignature } from "~/types";

describe("KindErrorSignature<TName,TContext>", () => {

    
    it("no schema", () => {
        // when no schema is defined then a looser approach is taken 
        // with the context object 
        type T1 = KindErrorSignature<"Testing", Record<string, unknown>>;

        type Params = Parameters<T1>;
        type Rtn = ReturnType<T1>;
    
        type cases = [
            Expect<AssertEqual<
                Params,
                [ msg: string, ctx?: Record<string, unknown> ]
            >>
        ];
    });
    

    it("no variant key/values", () => {
        type T1 = KindErrorSignature<"Testing", {test: true}>;

        type P = Parameters<T1>;
        type Rtn = ReturnType<T1>;

        type cases = [
            Expect<AssertEqual<P, [msg: string]>>,
            Expect<Rtn extends KindError ? true : false>,
        ];
    });

    
    it("test", () => {
        type T = KindErrorSignature<"testing", {
                test: true,
                foo: "string | undefined"
            }>;

        type P = Parameters<T>;
        type Rtn = ReturnType<T>;
    
        type cases = [
            Expect<AssertEqual<P, [msg: string, ctx?: { foo?: string }]>>,
        ];
    });
    

    it("no required but with optional context", () => {
        type T = KindErrorSignature<"testing", {test: true, answer: 42 | undefined}>

        type P = Parameters<T>;
        type Rtn = ReturnType<T>;

        type cases = [
            Expect<AssertEqual<P, [msg: string, ctx?: { answer?: 42 }]>>,
            Expect<AssertExtends<Rtn, KindError>>,
        ];
    });

    it("required prop", () => {
        type T1 = KindErrorSignature<"Testing", {test: true, answer: 42 | 99}>
        type P = Parameters<T1>;
        type Rtn = ReturnType<T1>;

        type cases = [
            Expect<AssertEqual<P, [msg: string, ctx: { answer: 42 | 99 }]>>,
            Expect<AssertExtends<Rtn, KindError>>,
        ];
    });

});
