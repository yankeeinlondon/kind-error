import { describe, it } from "vitest";
import {
    Expect,
    Test,
} from "inferred-types/types";
import { DetectOptionalValues } from "~/types";
import { AssertEqual, Dictionary, EmptyObject } from "inferred-types";

describe("DetectOptionalValues", () => {

    it("empty object", () => {
        type T = DetectOptionalValues<EmptyObject>; 

        type cases = [
            Expect<AssertEqual<T, EmptyObject>>
        ];
    });

    it("wide dictionary", () => {
        type T = DetectOptionalValues<Dictionary<string>>; 

        type cases = [
            Expect<AssertEqual<T, Dictionary<string>>>
        ];
    });

    
    it("keys are literals", () => {
        type T = DetectOptionalValues<{foo: "foo"; bar: "bar"}>; 

        type cases = [
            Expect<AssertEqual<T, {foo: "foo"; bar: "bar"}>>
        ];
    });

    it("some literals mixed with undefined union", () => {
        type T = DetectOptionalValues<{foo: "foo"; bar: "bar" | undefined}>; 

        type cases = [
            Expect<AssertEqual<T, {foo: "foo"; bar?: "bar"}>>
        ];
    });

    it("all optional", () => {
        type T = DetectOptionalValues<{foo: "foo" | undefined; bar: "bar" | undefined}>; 

        type cases = [
            Expect<AssertEqual<T, {foo?: "foo"; bar?: "bar"}>>
        ];
    });
    

});
