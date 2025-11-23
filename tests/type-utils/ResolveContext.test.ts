import { describe, it } from "vitest";
import {
    Dictionary,
    Expect,
    Test,
} from "inferred-types/types";
import { ResolveContext } from "~";
import { AssertEqual, EmptyObject } from "inferred-types";

describe("ResolveContext<TSchema,TCtx>", () => {

    it("undefined schema, no context", () => {
        type T = ResolveContext<Record<string, unknown>, undefined>

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>
        ];
    });

    
    it("undefined schema, with context", () => {
        type T = ResolveContext<Record<string, unknown>, { foo: "foo"; bar: "bar" }>
    
        type cases = [
            Expect<AssertEqual<T, { foo: "foo"; bar: "bar" }>>
        ];
    });

    
    it("empty schema, context undefined", () => {
        type T = ResolveContext<EmptyObject,undefined>;
    
        type cases = [
            Expect<AssertEqual<T, EmptyObject>>
        ];
    });

    
    it("test", () => {
        type T = ResolveContext<{ test: true }, {}>
    
        type cases = [
            /** type tests */
        ];
    });
    

    
    it("schema with literal, context undefined", () => {
        type T = ResolveContext<{lib: "kind-error"}, undefined>;
    
        type cases = [
            Expect<AssertEqual<T, { lib: "kind-error" }>>
        ];
    });

    
    it("schema with wide types, context filling in wide types", () => {
        type T = ResolveContext<{foo: string; bar: number}, { foo: "foo", bar: 42 }>;
    
        type cases = [
            Expect<AssertEqual<T, {foo: "foo"; bar: 42}>>
        ];
    });
    
    
    
    it("schema with one required, one optional; context fills required only", () => {
        type T = ResolveContext<{
            foo: string; 
            bar: number | undefined
        }, { foo: "foo" }
        >;
    
        type cases = [
            // this demonstrates the the schema's `bar` property is explicitly set to undefined
            // when it's not defined
            Expect<AssertEqual<T, {foo: "foo"}>>
        ];
    });

    it("schema with one required, one optional; context fills required and optional", () => {
        type T = ResolveContext<{foo: string; bar: number | undefined}, { foo: "foo", bar: 42 }>;
    
        type cases = [
            // this demonstrates the the schema's `bar` property is left off
            // when it's not defined
            Expect<AssertEqual<T, {foo: "foo"; bar: 42}>>
        ];
    });

    it("schema with one required, one optional; context fills required and optional but optional wrong type", () => {
        type T = ResolveContext<{foo: string; bar: number | undefined}, { foo: "foo", bar: false }>;
    
        type cases = [
            // this shouldn't happen but if it does a warning and the intended
            // schema are included
            Expect<AssertEqual<T, {
                foo: "foo"; 
                bar: false;
                __warning: `The context provided for this error had properties which were inconsistent with the schema defined by the KindErrorType!`;
                __schema: { foo: string; bar: number | undefined},
                __ctx: { foo: "foo", bar: false }
            }>>
        ];
    });

    
    it("schema provides literal and union type, context fills in union", () => {
        type T = ResolveContext<{ lib: "kind-error", color: "red" | "blue" }, { color: "red"}>

        type cases = [
            Expect<AssertEqual<T, { lib: "kind-error"; color: "red" }>>
        ];
    });

    it("schema provides literal and union type, context fills in union with wrong type", () => {
        type T = ResolveContext<{ lib: "kind-error", color: "red" | "blue" }, { color: "green"}>

        type cases = [
            Expect<AssertEqual<T, { 
                lib: "kind-error"; 
                color: "green";
                __warning: `The context provided for this error had properties which were inconsistent with the schema defined by the KindErrorType!`,
                __schema: { color: "red" | "blue" },
                __ctx: { color: "green" }
            }>>
        ];
    });

    it("schema with only literals (no variants), context provided anyway", () => {
        type T = ResolveContext<{ lib: "kind-error"; version: 42 }, { foo: "bar" }>;

        type cases = [
            // Should include warning since schema has no variant properties
            // but context was provided anyway (goes through lines 26-36)
            Expect<AssertEqual<T, {
                lib: "kind-error";
                version: 42;
                foo: "bar";
                __warning: `context was supposed to be empty as defined by the schema but context was added anyway!`
            }>>
        ];
    });




});
