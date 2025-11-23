import { describe, it } from "vitest";
import {
    Expect,
    AssertEqual, 
    EmptyObject,
} from "inferred-types/types";
import { Variants } from "~/types";

describe("StripNonVariantValues<T>", () => {

    it("empty object", () => {
        type T = Variants<EmptyObject>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("single non-variant", () => {
        type T = Variants<{ foo: "foo" }>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("multiple non-variants", () => {
        type T = Variants<{ foo: "foo", bar: "bar", baz: 42 }>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("wide type is considered variant", () => {
        type T = Variants<{ foo: string; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, {foo: string}>>,
        ];
    });    

    it("union type is considered variant", () => {
        type T = Variants<{ foo: 1|2|3; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, {foo: 1|2|3}>>,
        ];
    });

    it("handling optional properties", () => {
        type T = Variants<{ foo?: 1|2|3; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, {foo: 1|2|3|undefined}>>,
        ];
    });    

    it("null is considered non-variant", () => {
        type T = Variants<{ foo: null; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("undefined literal is considered non-variant", () => {
        type T = Variants<{ foo: undefined; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>,
        ];
    });

    it("undefined in union with literal is considered variant", () => {
        type T = Variants<{ foo: undefined | "foo"; bar: "bar" }>;

        type cases = [
            Expect<AssertEqual<T, {foo: "foo" | undefined}>>,
        ];
    });

    describe("using tokens", () => {
        it("wide token is non-variant", () => {
            type T = Variants<{ foo: "string"; bar: "bar" }>;

            type cases = [
                Expect<AssertEqual<T, {foo: string}>>,
            ];
        });

        it("union token is non-variant", () => {
            type T = Variants<{ foo: `"foo" | undefined`; bar: "bar" }>;

            type cases = [
                Expect<AssertEqual<T, {foo: "foo" | undefined}>>,
            ];
        });
    })

});
