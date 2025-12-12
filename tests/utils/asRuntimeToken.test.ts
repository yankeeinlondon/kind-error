import { describe, expect, it } from "vitest";
import {
    Expect,
    Test,
} from "inferred-types/types";
import { asRuntimeToken, schemaProp, TOKEN_END, TOKEN_START } from "~/utils";
import { AssertEqual, AssertExtends } from "inferred-types";
import { isRuntimeTokenCallback, RuntimeToken, RuntimeTokenCallback, SchemaApi } from "~";

describe("asRuntimeToken(val)", () => {

    it("from RuntimeToken -> proxy result", () => {
        const token = `${TOKEN_START}string${TOKEN_END}` as const;
        const asToken = asRuntimeToken(token);

        type cases = [
            Expect<AssertEqual<typeof asToken, typeof token>>
        ];
    });

    
    it("inner token content is wrapped with token start and end markers", () => {
        const asToken = asRuntimeToken("string");
    
        type cases = [
            Expect<AssertEqual<typeof asToken, RuntimeToken<"string">>>
        ];
    });
    

    
    it("scalar value is tokenized", () => {
        const str = asRuntimeToken("foo");
        const num = asRuntimeToken(42);
        const yup = asRuntimeToken(true);
        const yup2 = asRuntimeToken("true");
        const nope = asRuntimeToken(false);
        const nope2 = asRuntimeToken("false");
        const bool = asRuntimeToken("boolean");
    
        type cases = [
            Expect<AssertEqual<typeof str, RuntimeToken<"string::foo">>>,
            Expect<AssertEqual<typeof num, RuntimeToken<"number::42">>>,
            Expect<AssertEqual<typeof yup, RuntimeToken<"true">>>,
            Expect<AssertEqual<typeof yup2, RuntimeToken<"true">>>,
            Expect<AssertEqual<typeof nope, RuntimeToken<"false">>>,
            Expect<AssertEqual<typeof nope2, RuntimeToken<"false">>>,
            Expect<AssertEqual<typeof bool, RuntimeToken<"boolean">>>,
        ];
    });

    
    it("using a SchemaCallback", () => {
        const cb = schemaProp(t => t.array("string"));
        const token = asRuntimeToken(cb);

        expect(isRuntimeTokenCallback(cb)).toBe(true);

        if(isRuntimeTokenCallback(cb)) {
            type CB = typeof cb;
            const considering = asRuntimeToken(cb);
            type cases = [
                Expect<AssertExtends<CB, RuntimeTokenCallback>>
            ];
        }

    
    });
    
    

});
