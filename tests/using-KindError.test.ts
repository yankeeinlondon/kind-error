import type { Equal, Expect } from "@type-challenges/utils";
import type {
    EmptyObject,
    Extends,
    Narrowable,
} from "inferred-types";
import type {
    KindError,
    KindErrorType,
    KindErrorTypeName,
} from "../src";
import { describe, expect, it } from "vitest";
import {
    createKindError,
    isError,
    isKindError,

} from "../src";

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
            Expect<Extends<
                typeof FooBar,
                KindErrorType<"foo/bar", { foo: 42 }>
            >>,
        ];
    });

    it("static props without base context", () => {
        const FooBar = createKindError("foo/bar");

        expect(FooBar.name).toBe("FooBarErrorType");
        expect(FooBar.kind).toBe("foo/bar");
        expect(FooBar.type).toBe("foo");
        expect(FooBar.subType).toBe("bar");
        expect(FooBar.errorName).toBe("FooBar");
        expect(typeof FooBar.rebase).toBe("function");
        expect(typeof FooBar.is).toBe("function");
        expect(typeof FooBar.proxy).toBe("function");

        expect(FooBar.context).toEqual({});
        expect(FooBar.toString()).toBe("KindErrorType::FooBar(foo/bar)");

        type cases = [
            Expect<Equal<
                typeof FooBar,
                KindErrorType<"foo/bar", Record<string, Narrowable>>
            >>,
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
            Expect<Equal<
                typeof FooBar,
                KindError<"foo/bar", EmptyObject>
            >>,
        ];
    });

    it("instantiate a KindError with context", () => {
        const FooBarType = createKindError("foo/bar", {
            bob: "yur uncle",
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
            Expect<Equal<typeof FooBar, KindError<"foo/bar", {
                bob: "yur uncle";
                uncle: "bob";
            }>>>,
        ];
    });

    it("rebasing", () => {
        const FooBar = createKindError("foo-bar", { bar: true });
        const Rebased = FooBar.rebase({ foo: 1 });

        expect(Rebased.name).toBe("FooBarErrorType");
        expect(Rebased.context.foo).toBe(1);
        expect(Rebased.context.bar).toBe(true);

        const err1a = FooBar("oh my!");
        const err2a = FooBar("oh my!", {});

        const err1b = Rebased("oh my!");
        expect(err1b?.context).toEqual({ foo: 1, bar: true });

        const err2b = Rebased("oh my!", {});

        expect(err1a.name).toEqual("FooBar");
        expect(err1a.kind).toEqual("foo-bar");
        expect(err1a.context).toEqual({ bar: true });
        expect(err2a.context).toEqual({ bar: true });

        expect(err2b.context).toEqual({ foo: 1, bar: true });

        type cases = [
            Expect<Extends<
                typeof FooBar,
                KindErrorType<"foo-bar", { bar: true }>
            >>,
            Expect<Extends<
                typeof Rebased,
                KindErrorType<"FooBar", { foo: 1; bar: true }>
            >>,
            Expect<Extends<
                typeof err1a,
                KindError<"FooBar", { bar: true }>
            >>,
            Expect<Extends<
                typeof err2a,
                KindError<"FooBar", { bar: true }>
            >>,
            Expect<Extends<
                typeof err1b["context"],
                { foo: 1; bar: true }
            >>,
            Expect<Extends<
                typeof err2b,
                KindError<"FooBar", { foo: 1; bar: true }>
            >>,
        ];
    });

    it("with non-conflicting base context", () => {
        const err = createKindError("foo-bar", { foo: 42 });
        const fooBar = err("oh my!", { bar: 55 });

        expect(fooBar.name).toEqual("FooBar");
        expect(fooBar.kind).toEqual("foo-bar");

        expect(fooBar.context).toEqual({ foo: 42, bar: 55 });

        type cases = [
            Expect<Extends<
                typeof err,
                KindErrorType<"foo-bar", { foo: 42 }>
            >>,
            Expect<Equal<typeof fooBar, KindError<"FooBar", { foo: 42; bar: 55 }>>>,
            Expect<Equal<(typeof fooBar)["kind"], "foo-bar">>,
            Expect<Equal<(typeof fooBar)["name"], "FooBar">>,
        ];
    });

    it("with conflicting base context", () => {
        const err = createKindError("foo-bar", { foo: 42 });
        const fooBar = err("oh my!", { foo: 1, bar: 55 });

        expect(fooBar.name).toEqual("FooBar");
        expect(fooBar.kind).toEqual("foo-bar");

        expect(fooBar.context).toEqual({ foo: 1, bar: 55 });

        // @ts-ignore
        type _cases = [
            Expect<Extends<typeof err, KindErrorType<"foo-bar", { foo: 42 }>>>,
            Expect<Equal<typeof fooBar, KindError<"FooBar", { foo: 1; bar: 55 }>>>,
            Expect<Equal<(typeof fooBar)["kind"], "foo-bar">>,
            Expect<Equal<(typeof fooBar)["name"], "FooBar">>,
        ];
    });

    it("with awkward name", () => {
        const err = createKindError("FooBar<Baz>");
        const fooBarBaz = err("well, well");

        expect(err.kind).toBe("foo-bar-baz");
        expect(err.type).toBe("foo-bar-baz");
        expect(err.subType).toBe(undefined);
        expect(err.name).toBe("FooBarBazErrorType");

        expect(fooBarBaz.name).toEqual("FooBarBaz");
        expect(fooBarBaz.kind).toEqual("foo-bar-baz");
        expect(fooBarBaz.type).toEqual("foo-bar-baz");
        expect(fooBarBaz.subType).toEqual(undefined);

        type cases = [
            Expect<Equal<typeof fooBarBaz["context"], EmptyObject>>,
            Expect<Extends<
                typeof fooBarBaz,
                KindError<"FooBarBaz", EmptyObject>
            >>,
        ];
    });
});
