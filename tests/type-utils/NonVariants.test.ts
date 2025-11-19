import { describe, it } from "vitest";
import {
    Expect,
} from "inferred-types/types";
import { NonVariants } from "~";
import { AssertEqual, Dictionary, EmptyObject } from "inferred-types";

describe("NonVariants<T>", () => {

    it("empty object", () => {
        type T = NonVariants<EmptyObject>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("wide/no config", () => {
        type T = NonVariants<Record<string, unknown>>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    
    it("static kv", () => {
        type T = NonVariants<{ foo: "foo"; lib: "kind-error" }>;
    
        type cases = [
            Expect<AssertEqual<T, { foo: "foo"; lib: "kind-error" }>>
        ];
    });

    
    it("mixed", () => {
        type T = NonVariants<{ foo: "foo"; bar: string; baz: 1|2|3 }>;
    
        type cases = [
            Expect<AssertEqual<T, { foo: "foo"}>>
        ];
    });
    
    

});
