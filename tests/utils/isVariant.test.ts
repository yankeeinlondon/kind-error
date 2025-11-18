import { describe, expect, it } from "vitest";
import {
    Expect,
    AssertEqual, 
    AssertFalse, 
    AssertTrue
} from "inferred-types/types";
import { isVariant } from "~/utils/isVariant";


describe("isVariant(val)", () => {

    
    it("wide string produces boolean type, runtime resolves", () => {
        const t1 = isVariant("string" as string);

        expect(t1).toBe(true);
    
        type cases = [
            Expect<AssertEqual<typeof t1, boolean>>
        ];
    });
    

    it("wide tokens", () => {
        const t1 = isVariant("string");
        const t2 = isVariant("number");
        const t3 = isVariant("boolean");

        expect(t1).toBe(true);
        expect(t2).toBe(true);
        expect(t3).toBe(true);

        type cases = [
            Expect<AssertTrue<typeof t1>>,
            Expect<AssertTrue<typeof t2>>,
            Expect<AssertTrue<typeof t3>>,
        ];
    });

    it("wide array tokens", () => {
        const t1 = isVariant("string[]");
        const t2 = isVariant("number[]");
        const t3 = isVariant("boolean[]");
        const t4 = isVariant("Array<string>");
        const t5 = isVariant("Array<number>");
        const t6 = isVariant("Array<boolean>");

        expect(t1).toBe(true);
        expect(t2).toBe(true);
        expect(t3).toBe(true);
        expect(t4).toBe(true);
        expect(t5).toBe(true);
        expect(t6).toBe(true);

        type cases = [
            Expect<AssertTrue<typeof t1>>,
            Expect<AssertTrue<typeof t2>>,
            Expect<AssertTrue<typeof t3>>,
            Expect<AssertTrue<typeof t4>>,
            Expect<AssertTrue<typeof t5>>,
            Expect<AssertTrue<typeof t6>>,
        ];
    });

    it("literal tokens", () => {
        const f1 = isVariant(`"foo"`);
        const f2 = isVariant(`42`);
        const f3 = isVariant(`true`);

        expect(f1).toBe(false);
        expect(f2).toBe(false);
        expect(f3).toBe(false);

        type cases = [
            Expect<AssertFalse<typeof f1>>,
            Expect<AssertFalse<typeof f2>>,
            Expect<AssertFalse<typeof f3>>,
        ];
    });


    
    it("non-token literal", () => {
        const f1 = isVariant("foo");
    
        type cases = [
            Expect<AssertFalse<typeof f1>>
        ];
    });
    
});
