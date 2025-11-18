import { describe, expect, it } from "vitest";
import type {
    Expect,
    AssertEqual, 
    AssertExtends
} from "inferred-types/types";
import { asError } from "~/utils/asError";
import {  err } from 'inferred-types';

describe("asError", () => {

    it("happy path", () => {
        const t0 = asError(new Error("uh oh"));
        const t1 = err("uh oh");
        const t2 = asError(`uh oh`);
        const t3 = asError({code: 500, message: "uh oh"});

        expect(t1 instanceof Error).toBe(true);

        type cases = [
            // all should extend Error
            Expect<AssertExtends<typeof t0, Error>>,
            Expect<AssertExtends<typeof t1, Error>>,
            Expect<AssertExtends<typeof t2, Error>>,
            Expect<AssertExtends<typeof t3, Error>>,
        ];
    });

    
    it("literals preserved", () => {
        const t1 = err("bad juju", "uh oh");
        const t2 = asError(`uh oh`);
        const t3 = asError({code: 500, message: "uh oh"});
    
        type cases = [
            Expect<AssertEqual<typeof t1["message"], "uh oh">>,
            Expect<AssertEqual<typeof t1["type"], "bad juju">>,

            Expect<AssertEqual<typeof t2["message"], "uh oh">>,

            Expect<AssertEqual<typeof t3["message"], "uh oh">>,
            Expect<AssertEqual<typeof t3["code"], 500>>,
        ];
    });
    

});
