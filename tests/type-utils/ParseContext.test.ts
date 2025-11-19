import { describe, it } from "vitest";
import {
    AssertEqual,
    Dictionary,
    Expect,
    EmptyObject
} from "inferred-types/types";
import { ParseContext } from "~/index";

describe("ParseContext<T>", () => {

    it("empty object", () => {
        type T = ParseContext<EmptyObject>; 

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>
        ];
    });

    it("wide dictionary", () => {
        type T = ParseContext<Record<string, unknown>>; 

        type cases = [
            Expect<AssertEqual<T, Record<string, unknown>>>
        ];
    });

    
    it("keys are literals", () => {
        type T = ParseContext<{foo: "foo"; bar: "bar"}>; 

        type cases = [
            Expect<AssertEqual<T, {foo: "foo"; bar: "bar"}>>
        ];
    });

    it("some literals mixed with undefined union", () => {
        type T = ParseContext<{foo: "foo"; bar: "bar" | undefined}>; 

        type cases = [
            Expect<AssertEqual<T, {foo: "foo"; bar: "bar" | undefined}>>
        ];
    });

    it("token only", () => {
        type T = ParseContext<{foo: "string | undefined"; bar: "number"}>; 

        type cases = [
            Expect<AssertEqual<T, {foo: string | undefined; bar: number }>>
        ];
    });

    it("mixed tokens and literals", () => {
        type T = ParseContext<{foo: "string | undefined"; bar: "hello"}>; 

        type cases = [
            Expect<AssertEqual<T, {foo: string | undefined; bar: "hello" }>>
        ];
    });

    it("immutable mixed tokens and literals", () => {
        type T = ParseContext<{readonly foo: "string | undefined"; readonly bar: "hello"}>; 

        type cases = [
            Expect<AssertEqual<T, {foo: string | undefined; bar: "hello" }>>
        ];
    });

});
