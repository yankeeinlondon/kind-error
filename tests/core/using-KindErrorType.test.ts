import type { Equal, Expect } from "@type-challenges/utils";
import type {
    EmptyObject,
    Extends,
} from "inferred-types/types";
import type {
    KindError,
    KindErrorTypeName,
} from "~";
import { describe, expect, it } from "vitest";
import {
    createKindError,
    isError,
    isKindError,

} from "~";
import { AssertExtends, isArray } from "inferred-types";

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
        expect(typeof FooBar.is).toBe("function");
        expect(typeof FooBar.proxy).toBe("function");

        expect(FooBar.schema).toEqual({ foo: 42 });

        const expected = {
            name: "FooBarErrorType",
            __kind: "KindErrorType",
            kind: "foo/bar",
            type: "foo",
            subType: "bar",
            schema: { foo: 42 },
            errorName: "FooBar",
        };
        const str = JSON.stringify(FooBar);
        const test = JSON.parse(str);
        expect(test).toEqual(expected);
        expect(FooBar.toString()).toBe("KindErrorType::FooBar ({ foo: 42 })");

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
            Expect<AssertExtends<typeof FooBar["schema"], { foo: 42 }>>,
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

        expect(FooBar.schema).toEqual({});
        expect(FooBar.toString()).toBe("KindErrorType::FooBar ({  })");

        type cases = [
            // Expect<AssertExtends<
            //     typeof FooBar,
            //     KindErrorType<"foo/bar">
            // >>,
            Expect<Equal<typeof FooBar["kind"], "foo/bar">>,
            Expect<Extends<typeof FooBar["schema"], {}>>,
            Expect<Extends<{}, typeof FooBar["schema"]>>,
        ];
    });

    it("instantiate a KindError with no context", () => {
        const FooBarType = createKindError("foo/bar");
        const FooBar = FooBarType(`Bad Juju!`);

        expect(FooBar.kind).toBe("foo/bar");
        expect(FooBar.type).toBe("foo");
        expect(FooBar.subType).toBe("bar");
        expect(FooBar.message).toBe("Bad Juju!");
        expect(isArray(FooBar.stackTrace)).toBe(true);

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
            uncle: t => t.string()
        });
        const FooBar = FooBarType(`Bad Juju!`, { uncle: "bob" });

        expect(FooBar.kind).toBe("foo/bar");
        expect(FooBar.type).toBe("foo");
        expect(FooBar.subType).toBe("bar");
        expect(FooBar.message).toBe("Bad Juju!");
        expect(isArray(FooBar.stackTrace)).toBe(true);

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

    it("with awkward name", () => {
        const err = createKindError("FooBar<Baz>");
        // now returns an error
        expect(err instanceof Error).toBe(true);

        expect(err.message).toContain("The name for a KindError must not include any of the following characters");
    });
});
