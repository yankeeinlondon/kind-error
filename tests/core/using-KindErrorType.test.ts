import type { Equal, Expect } from "@type-challenges/utils";
import type {
    EmptyObject,
    Extends,
} from "inferred-types/types";
import type {
    KindError,
    KindErrorType,
    KindErrorTypeName,
} from "~";
import { describe, expect, it } from "vitest";
import {
    createKindError,
    isError,
    isKindError,

} from "~";
import { AssertExtends } from "inferred-types";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("kindError", () => {
    it("static props with base context", () => {
        const FooBar = createKindError("foo/bar", {
            foo: 42,
        });

        expect(FooBar.name).toBe("FooBarErrorType");
        expect(FooBar.kind).toBe("foo/bar");
        expect(FooBar.type).toBe("foo");
        expect(FooBar.subType).toBe("bar");
        expect(FooBar.errorName).toBe("FooBar");
        expect(typeof FooBar.rebase).toBe("function");
        expect(typeof FooBar.is).toBe("function");
        expect(typeof FooBar.proxy).toBe("function");

        expect(FooBar.context).toEqual({ foo: 42 });

        const expected = {
            name: "FooBarErrorType",
            __kind: "KindErrorType",
            kind: "foo/bar",
            type: "foo",
            subType: "bar",
            context: { foo: 42 },
            errorName: "FooBar",
        };
        const str = JSON.stringify(FooBar);
        const test = JSON.parse(str);
        expect(test).toEqual(expected);
        expect(FooBar.toString()).toBe("KindErrorType::FooBar(foo/bar)");

        type Name = KindErrorTypeName<"foo/bar">;

        type cases = [
            Expect<Equal<
                Name,
                "FooBarErrorType"
            >>,
            // Expect<Extends<
            //     typeof FooBar,
            //     KindErrorType<"foo/bar", { foo: 42 }>
            // >>,
            Expect<Equal<typeof FooBar["kind"], "foo/bar">>,
            Expect<Equal<typeof FooBar["context"], { foo: 42 }>>,
        ];
    });

    it("static props without base context", () => {
        const FooBar = createKindError("foo/bar");

        expect(FooBar.name).toBe("FooBarErrorType");
        expect(FooBar.kind).toBe("foo/bar");
        expect(FooBar.type).toBe("foo");
        expect(FooBar.subType).toBe("bar");
        expect(FooBar.errorName).toBe("FooBar");
        expect(typeof FooBar.is).toBe("function");
        expect(typeof FooBar.proxy).toBe("function");

        expect(FooBar.context).toEqual({});
        expect(FooBar.toString()).toBe("KindErrorType::FooBar(foo/bar)");

        type cases = [
            // Expect<AssertExtends<
            //     typeof FooBar,
            //     KindErrorType<"foo/bar">
            // >>,
            Expect<Equal<typeof FooBar["kind"], "foo/bar">>,
            Expect<Extends<typeof FooBar["context"], {}>>,
            Expect<Extends<{}, typeof FooBar["context"]>>,
        ];
    });

    it("instantiate a KindError with no context", () => {
        const FooBarType = createKindError("foo/bar");
        const FooBar = FooBarType(`Bad Juju!`);

        expect(FooBar.kind).toBe("foo/bar");
        expect(FooBar.type).toBe("foo");
        expect(FooBar.subType).toBe("bar");
        expect(FooBar.message).toBe("Bad Juju!");
        expect(typeof FooBar.stackTrace).toBe("function");

        // type guards
        expect(FooBarType.is(FooBar)).toBe(true);
        expect(isKindError(FooBar)).toBe(true);
        expect(isKindError(FooBar, "foo/bar")).toBe(true);

        type cases = [
            Expect<AssertExtends<
                typeof FooBar,
                KindError<"foo/bar", string, EmptyObject>
            >>,
        ];
    });

    it("instantiate a KindError with context", () => {
        const FooBarType = createKindError("foo/bar", {
            bob: "yur uncle",
            uncle: "string"
        });
        const FooBar = FooBarType(`Bad Juju!`, { uncle: "bob" });

        expect(FooBar.kind).toBe("foo/bar");
        expect(FooBar.type).toBe("foo");
        expect(FooBar.subType).toBe("bar");
        expect(FooBar.message).toBe("Bad Juju!");
        expect(typeof FooBar.stackTrace).toBe("function");

        // type guards
        expect(isError(FooBar)).toBe(true);
        expect(isKindError(FooBar, "foo/bar")).toBe(true);
        expect(isKindError(FooBar)).toBe(true);
        expect(FooBarType.is(FooBar)).toBe(true);

        type cases = [
            Expect<AssertExtends<typeof FooBar, KindError<"foo/bar", "Bad Juju!", Readonly<{
                bob: "yur uncle";
                uncle: "bob";
            }>>>>,
        ];
    });



    it.skip("with conflicting base context", () => {
        const err = createKindError("foo-bar", { foo: 42 });
        const fooBar = err("oh my!", { foo: 1, bar: 55 });

        expect(fooBar.name).toEqual("FooBar");
        expect(fooBar.kind).toEqual("foo-bar");

        expect(fooBar.context).toEqual({ foo: 1, bar: 55 });

        type _cases = [
            // Expect<Extends<typeof err, KindErrorType<"foo-bar", { foo: 42 }>>>,
            // Expect<AssertExtends<typeof fooBar, KindError<"FooBar", "oh my!", Readonly<{ foo: 1; bar: 55 }>>>>,
            Expect<Equal<(typeof fooBar)["kind"], "foo-bar">>,
            Expect<Equal<(typeof fooBar)["name"], "FooBar">>,
        ];
    });

    it("with awkward name", () => {
        const err = createKindError("FooBar<Baz>");
        // now returns an error
        expect(err instanceof Error).toBe(true);

        expect(err.message).toContain("The name for a KindError must not include any of the following characters");
    });
});
