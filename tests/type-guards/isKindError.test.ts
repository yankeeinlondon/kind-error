import { describe, expect, it } from "vitest";
import {
    AssertExtends,
    Expect,
} from "inferred-types/types";
import { isKindError } from "~/type-guards";
import { asError } from "~/utils";

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

        expect(e instanceof Error).toBe(true);
        expect(t).toBe(true);


        type cases = [
            Expect<AssertExtends<typeof e, Error>>
        ];
    });

});
