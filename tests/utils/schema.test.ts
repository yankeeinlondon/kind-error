import { describe, it, expect } from 'vitest';
import {
    Expect,
} from "inferred-types/types";
import { schemaProp } from "~/utils/schema";
import { AssertEqual, Suggest } from "inferred-types";

describe("Schema", () => {

    describe("schemaProp()", () => {

        it("scalars / non-variants", () => {
            const str = schemaProp(t => t.string());
            const num = schemaProp(t => t.number());
            const boolean = schemaProp(t => t.boolean());
            const yes = schemaProp(t => t.true());
            const no = schemaProp(t => t.false());
            const asNull = schemaProp(t => t.null());
            const asUndefined = schemaProp(t => t.undefined());
    
            type cases = [
                Expect<AssertEqual<typeof str, string>>,
                Expect<AssertEqual<typeof num, number>>,
                Expect<AssertEqual<typeof boolean, boolean>>,
                Expect<AssertEqual<typeof yes, true>>,
                Expect<AssertEqual<typeof no, false>>,
                Expect<AssertEqual<typeof asNull, null>>,
                Expect<AssertEqual<typeof asUndefined, undefined>>,
            ];
        });
        
        it("wide arrays", () => {
            const str = schemaProp(t => t.array("string"));
            const num = schemaProp(t => t.array("number"));
            const bool = schemaProp(t => t.array("boolean"));
            const union = schemaProp(t => t.array("string", "number"));
        
            type cases = [
                Expect<AssertEqual<typeof str, string[]>>,
                Expect<AssertEqual<typeof num, number[]>>,
                Expect<AssertEqual<typeof bool, boolean[]>>,
                Expect<AssertEqual<typeof union, (string | number)[]>>,
            ];
        });
        
        it("tuples", () => {
            const scalars = schemaProp(t => t.tuple("string","number"));
            const multi = schemaProp(t => t.tuple("string[]", "number[]"));
            const fooBar = schemaProp(t => t.tuple("'foo'","'bar'"));
        
            type cases = [
                Expect<AssertEqual<typeof scalars, [string, number]>>,
                Expect<AssertEqual<typeof multi, [string[], number[]]>>,
                Expect<AssertEqual<typeof fooBar, ["foo", "bar"]>>,
            ];
        });
        
        it("string literals and string literal unions", () => {
            const foo = schemaProp(t => t.string("foo"));
            const fooOrBar = schemaProp(t => t.string("foo", "bar"));
        
            type cases = [
                Expect<AssertEqual<typeof foo, "foo">>,
                Expect<AssertEqual<typeof fooOrBar, "foo" | "bar">>,
            ];
        });
        
        it("startsWith", () => {
            const foo = schemaProp(t => t.startsWith("foo"));
            const fooOrBar = schemaProp(t => t.startsWith("foo", "bar"));
        
            type cases = [
                Expect<AssertEqual<typeof foo, `foo${string}`>>,
                Expect<AssertEqual<typeof fooOrBar, `foo${string}` | `bar${string}`>>,
            ];
        });

        it("endsWith", () => {
            const foo = schemaProp(t => t.endsWith("foo"));
            const fooOrBar = schemaProp(t => t.endsWith("foo", "bar"));
        
            type cases = [
                Expect<AssertEqual<typeof foo, `${string}foo`>>,
                Expect<AssertEqual<typeof fooOrBar, `${string}foo` | `${string}bar`>>,
            ];
        });

        
        it("suggestions", () => {
            const fooBar = schemaProp(t => t.suggest("foo", "bar"));

            type Actual = typeof fooBar;
            type Expected = Suggest<"foo" | "bar">;
        
            type cases = [
                Expect<AssertEqual<Actual, Expected>>,
            ];
        });
        
        
        it("union", () => {
            const union = schemaProp(t => t.union("foo","bar",42));
        
            type cases = [
                Expect<AssertEqual<typeof union, "foo" | "bar" | 42>>
            ];
        });
        
        
        
        
    })


});
