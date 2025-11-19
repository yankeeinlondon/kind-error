import { describe, it } from "vitest";
import {
    AssertFalse,
    AssertTrue,
    Expect,
} from "inferred-types/types";
import { HasNonVariant } from "~";
import { Dictionary, EmptyObject } from "inferred-types";

describe("HasNonVariant<T>", () => {

    it("positive tests", () => {
        type T1 = HasNonVariant<{ lib: "kind-error"} >;
        type T2 = HasNonVariant<{ answer: 42; foo: string }>;
        type T3 = HasNonVariant<Record<string, unknown>>; // no config == optional anything

        type cases = [
            Expect<AssertTrue<T1>>,
            Expect<AssertTrue<T2>>,
            Expect<AssertTrue<T3>>,
        ];
    });

    
    it("negative tests", () => {
        type F1 = HasNonVariant<EmptyObject>;
        
        type F3 = HasNonVariant<{ answer: string }>;
        type F4 = HasNonVariant<{ answer: 42 | undefined }>;
    
        type cases = [
            Expect<AssertFalse<F1>>,
            Expect<AssertFalse<F3>>,
            Expect<AssertFalse<F4>>,
        ];
    });
    

});
