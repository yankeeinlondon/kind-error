import { describe, it } from "vitest";
import {
    Expect,
} from "inferred-types/types";
import { AsContext } from "~/types";
import { AssertEqual, EmptyObject } from "inferred-types";

describe("AsContext<Ctx>", () => {

    it("Empty Context", () => {
        type T = AsContext<EmptyObject>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>
        ];
    });

    
    it("Only non-variant key/values", () => {
        type T = AsContext<{foo: "foo"; bar: "bar"}>;
    
        type cases = [
            Expect<AssertEqual<T, EmptyObject>>
        ];
    });

    
    it("wide type is variant", () => {
       type T = AsContext<{foo: "string"; bar: "bar"}>;
    
        type cases = [
            Expect<AssertEqual<T, {foo: string }>>
        ];
    });
    
    
    it("union type is variant", () => {
       type T = AsContext<{foo: `"foo" | "bar"`; bar: "bar"}>;
    
        type cases = [
            Expect<AssertEqual<T, {foo: "foo" | "bar" }>>
        ];
    });

});
