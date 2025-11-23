import { describe, expect, it } from "vitest";
import { Expect, AssertExtends, isArray, isError, AssertEquals } from "inferred-types";
import { asKindError } from "~/utils/asKindError";
import { isKindError, KindError, KindStackItem } from "~";

describe("asKindError(obj)", () => {

    it("happy path", () => {
        const e = asKindError({ kind: "invalid-type", message: "uh oh"});

        expect(isArray(e.stackTrace), JSON.stringify(e.stackTrace)).toBe(true);
        expect(e.type).toBe("invalid-type");
        expect(e.subType).toBe(undefined);

        // Error Validate
        expect(isError(e)).toBe(true);
        expect(isKindError(e)).toBe(true);
        expect(isKindError(e, "invalid-type"));

        type E = typeof e;

        type cases = [
            Expect<AssertExtends<E["stackTrace"], KindStackItem[]>>,
            Expect<AssertExtends<E, Error>>,
            Expect<AssertExtends<E, KindError>>,
            Expect<AssertExtends<E, KindError<"invalid-type">>>,
        ];
    });

    
    it("with subtype", () => {
        const e = asKindError({ kind: "invalid-type/foo|bar", message: "uh oh"});

        expect(isArray(e.stackTrace), JSON.stringify(e.stackTrace)).toBe(true);
        expect(e.type).toBe("invalid-type");
        expect(e.subType).toBe("foo | bar"); // TODO: what should we do with the runtime value?

        // Error Validate
        expect(isError(e)).toBe(true);
        expect(isKindError(e)).toBe(true);
        expect(isKindError(e, "invalid-type"));

        type E = typeof e;

        type cases = [
            Expect<AssertExtends<E["stackTrace"], KindStackItem[]>>,
            Expect<AssertExtends<E["subType"], "foo" | "bar">>,
            Expect<AssertExtends<E, Error>>,
            Expect<AssertExtends<E, KindError>>,
            Expect<AssertExtends<E, KindError<"invalid-type/foo|bar">>>,
        ];
    });

    it("with numeric code", () => {
        const e = asKindError({ kind: "invalid-type", message: "uh oh", code: 404 });

        expect(isArray(e.stackTrace), JSON.stringify(e.stackTrace)).toBe(true);
        expect(e.type).toBe("invalid-type");


        // Error Validate
        expect(isError(e)).toBe(true);
        expect(isKindError(e)).toBe(true);
        expect(isKindError(e, "invalid-type"));
        expect(e.code).toBe(404);

        type E = typeof e;

        type cases = [
            Expect<AssertExtends<E["stackTrace"], KindStackItem[]>>,
            Expect<AssertEquals<E["code"], 404>>,

            Expect<AssertExtends<E, Error>>,
            Expect<AssertExtends<E, KindError>>,
            Expect<AssertExtends<E, KindError<"invalid-type">>>,
        ];
    }); 
    

});
