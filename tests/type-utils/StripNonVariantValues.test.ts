import { describe, it } from "vitest";
import {
    Expect,
    AssertEqual, 
    EmptyObject,
} from "inferred-types/types";
import { StripNonVariantValues } from "~/types";

describe("StripNonVariantValues<T>", () => {

    it("empty object", () => {
        type T = StripNonVariantValues<EmptyObject>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("single non-variant", () => {
        type T = StripNonVariantValues<{ foo: "foo" }>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("multiple non-variants", () => {
        type T = StripNonVariantValues<{ foo: "foo", bar: "bar", baz: 42 }>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("wide type is considered variant", () => {
        type T = StripNonVariantValues<{ foo: string; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, {foo: string}>>,
        ];
    });    

    it("union type is considered variant", () => {
        type T = StripNonVariantValues<{ foo: 1|2|3; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, {foo: 1|2|3}>>,
        ];
    });

    it("null is considered non-variant", () => {
        type T = StripNonVariantValues<{ foo: null; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("undefined literal is considered non-variant", () => {
        type T = StripNonVariantValues<{ foo: undefined; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("undefined in union with literal is considered variant", () => {
        type T = StripNonVariantValues<{ foo: undefined | "foo"; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, {foo: "foo" | undefined}>>,
        ];
    });

    describe("using tokens", () => {
        it("wide token is non-variant", () => {
            type T = StripNonVariantValues<{ foo: "string"; bar: "bar" }>;

            type cases = [
                Expect<AssertEqual<T, {foo: string}>>,
            ];
        });

        it("union token is non-variant", () => {
            type T = StripNonVariantValues<{ foo: `"foo" | undefined`; bar: "bar" }>;

            type cases = [
                Expect<AssertEqual<T, {foo: "foo" | undefined}>>,
            ];
        });
    })

});
