import { describe, expect, it } from "vitest";
import {
    AssertExtends,
    Expect,
} from "inferred-types/types";
import { isKindError } from "~/type-guards";
import { asError } from "~/utils";
import { err, Not } from "inferred-types";
import { createKindError, KindError } from "~";

describe("isKindError()", () => {

    it("hand rolled", () => {
        const e = asError({
            __kind: "KindError",
            name: "TestError",
            kind: "test-error",
            type: "test-error",
            subType: undefined,
            stackTrace: []
        });

        const t = isKindError(e)
        const f = isKindError(err("uh oh"))

        expect(e instanceof Error).toBe(true);
        expect(t).toBe(true);
        expect(f).toBe(false);

        type cases = [
            Expect<AssertExtends<typeof e, Error>>
        ];
    });

    
    it("from KindErrorType", () => {
        const MyError = createKindError("my-error", { lib: "kind-error" });
        const err = MyError("Uh oh!");
        const f = isKindError(MyError)
        const t = isKindError(err);

        expect(f).toBe(false);
        expect(t).toBe(true);
        
    
        type cases = [
            Expect<Not<AssertExtends<typeof MyError, KindError>>>,
            Expect<AssertExtends<typeof err, KindError>>,
        ];
    });

    it("from KindErrorType, with explicit kind comparison", () => {
        const MyError = createKindError("my-error", { lib: "kind-error" });
        const err = MyError("Uh oh!");
        const t = isKindError(err, "my-error");
        const f1 = isKindError(MyError)
        const f2 = isKindError(err, "MyFakeError");

        expect(t).toBe(true);
        expect(f1).toBe(false);
        expect(f2).toBe(false);
    
        type cases = [
            Expect<Not<AssertExtends<typeof MyError, KindError>>>,
            Expect<AssertExtends<typeof err, KindError<"my-error">>>,
        ];
    });

    it("from KindErrorType, with explicit kind comparison (fuzzy match)", () => {
        const MyError = createKindError("my-error", { lib: "kind-error" });
        const err = MyError("Uh oh!");
        const t1 = isKindError(err, "MyError");
        const t2 = isKindError(err, "myError");
        const f1 = isKindError(MyError)
        const f2 = isKindError(err, "MyFakeError");

        expect(t1).toBe(true);
        expect(t2).toBe(true);
        expect(f1).toBe(false);
        expect(f2).toBe(false);
        
    
        type cases = [
            Expect<Not<AssertExtends<typeof MyError, KindError>>>,
            Expect<AssertExtends<typeof err, KindError<"my-error">>>,
        ];
    });
    

});
