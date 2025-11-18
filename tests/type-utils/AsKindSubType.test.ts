import { describe, it } from "vitest";
import {
    Expect,
    AssertEqual
} from "inferred-types/types";
import { AsKindSubType } from "~";

describe("AsKindSubType<T>", () => {

    it("none", () => {
        type T = AsKindSubType<"testing">;

        type cases = [
            Expect<AssertEqual<T, undefined>>
        ];
    });

    it("wide", () => {
        type T = AsKindSubType<string>;

        type cases = [
            Expect<AssertEqual<T, string | undefined>>
        ];
    });

    
    it("static", () => {
        type T = AsKindSubType<"testing/one">;
    
        type cases = [
            Expect<AssertEqual<T, "one">>
        ];
    });

    it("union", () => {
        type T = AsKindSubType<"testing/one|two|three">;
    
        type cases = [
            Expect<AssertEqual<T, "one" | "two" | "three">>
        ];
    });
    
});
