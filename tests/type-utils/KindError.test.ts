import { describe, it } from "vitest";
import {
    Expect,
    AssertEqual
} from "inferred-types/types";
import { KindError } from "~";


describe("KindError<TName,TMsg,TContext>", () => {

    it("just name", () => {
        type T = KindError<"foobar">;

        type cases = [
            Expect<AssertEqual<T["kind"], "foobar">>,
            Expect<AssertEqual<T["type"], "foobar">>,
            Expect<AssertEqual<T["subType"], undefined>>,
            Expect<AssertEqual<T["message"], string>>,
        ];
    });

    
    it("name and message", () => {
        type T = KindError<"foobar", "bad juju">;
    
        type cases = [
            Expect<AssertEqual<T["kind"], "foobar">>,
            Expect<AssertEqual<T["type"], "foobar">>,
            Expect<AssertEqual<T["subType"], undefined>>,
            Expect<AssertEqual<T["message"], "bad juju">>,
        ];
    });

    it("name, message, and context", () => {
        type T = KindError<"foobar", "bad juju", { lib: "KindError" }>;
    
        type cases = [
            Expect<AssertEqual<T["kind"], "foobar">>,
            Expect<AssertEqual<T["type"], "foobar">>,
            Expect<AssertEqual<T["subType"], undefined>>,
            Expect<AssertEqual<T["message"], "bad juju">>,
            Expect<AssertEqual<T["lib"], "KindError">>,
        ];
    });

    it("has static subType", () => {
        type T = KindError<"foo/bar">;
    
        type cases = [
            Expect<AssertEqual<T["kind"], "foo/bar">>,
            Expect<AssertEqual<T["type"], "foo">>,
            Expect<AssertEqual<T["name"], "Foo">>,
            Expect<AssertEqual<T["subType"], "bar">>,
            Expect<AssertEqual<T["message"], string>>,
        ];
    });

    it("has union subType", () => {
        type T = KindError<"foo/bar|baz">;
    
        type cases = [
            Expect<AssertEqual<T["kind"], "foo/bar|baz">>,
            Expect<AssertEqual<T["type"], "foo">>,
            Expect<AssertEqual<T["name"], "Foo">>,
            Expect<AssertEqual<T["subType"], "bar" | "baz">>,
            Expect<AssertEqual<T["message"], string>>,
        ];
    });
    

});
