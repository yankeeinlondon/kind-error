import { describe, it } from "vitest";
import {
    Dictionary,
    Expect,
    Test,
} from "inferred-types/types";
import { RemoveVariants } from "~";
import { AssertEqual, EmptyObject } from "inferred-types";

describe("RemoveVariants<T>", () => {
    it("no schema", () => {
        type T = RemoveVariants<Dictionary<string>>;

        type cases = [
            Expect<AssertEqual<T,EmptyObject>>,
        ];
    });

    it("explicit empty object", () => {
        type T = RemoveVariants<EmptyObject>;

        type cases = [
            Expect<AssertEqual<T,EmptyObject>>,
        ];
    });

    it("single static entry", () => {
        type T = RemoveVariants<{foo: "foo"}>;

        type cases = [
            Expect<AssertEqual<T,{foo: "foo"}>>,
        ];
    });

    it("only variants in schema", () => {
        type T = RemoveVariants<{foo: "foo" | "bar"; bar: "foo" | "bar"}>;

        type cases = [
            Expect<AssertEqual<T,EmptyObject>>,
        ];
    });

    it("mix of static and variants in schema", () => {
        type T = RemoveVariants<{foo: "foo"; bar: "foo" | "bar"}>;

        type cases = [
            Expect<AssertEqual<T, {foo: "foo"}>>,
        ];
    });

});
