import { describe, it } from "vitest";
import {
    Expect,
    Test,
} from "inferred-types/types";
import {  KindError, KindErrorSignature } from "~/types";
import { AssertEqual, AssertExtends, EmptyObject, Fallback } from "inferred-types";

describe("KindErrorSignature<TName,TContext>", () => {

    it("no required or optional context", () => {
        type T1 = KindErrorSignature<"Testing", {test: true}>;
        type P = Parameters<T1>;

        type cases = [
            Expect<AssertEqual<P, [msg: string]>>,

            Expect<AssertEqual<
                T1,
                <TMsg extends string>(msg: TMsg) => KindError<"Testing",TMsg, {test:true}>
            >>
        ];
    });

    it("no required but with optional context", () => {
        type T1 = KindErrorSignature<"Testing", {test: true, answer: 42 | undefined}>
        type P = Parameters<T1>;
        type R = ReturnType<T1>;

        type cases = [
            Expect<AssertEqual<P, [msg: string, ctx?: { answer?: 42 }]>>,
            Expect<AssertExtends<ReturnType<T1>, KindError>>,

            Expect<AssertEqual<
                T1,
                <
                    TMsg extends string, 
                    TCtx extends { answer?: 42 }
                >(msg: TMsg, ctx?: TCtx) => KindError<"Testing",TMsg, {test:true} & Fallback<TCtx, EmptyObject>>
            >>
        ];
    });

});
