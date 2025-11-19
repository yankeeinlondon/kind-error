import { describe, expect, it } from "vitest";
import {
    Expect,
    Test,
} from "inferred-types/types";
import { createKindError } from "~";

describe("KindErrorType.is()", () => {

    it("positive tests", () => {
        const InvalidType = createKindError("invalid-type");
        const TypeError = createKindError("TypeError", {
            lib: "kind-error",
            critical: "boolean | undefined"
        });

        const invalid = InvalidType.is(InvalidType("uh oh"));
        const typeError = TypeError.is(TypeError("uh oh"));

        expect(invalid).toBe(true);
        expect(typeError).toBe(true);

    });

    it("negative tests", () => {
        const InvalidType = createKindError("invalid-type");
        const TypeError = createKindError("TypeError", {
            lib: "kind-error",
            critical: "boolean | undefined"
        });

        const invalid = InvalidType.is(TypeError("uh oh"));
        const typeError = TypeError.is(InvalidType("uh oh"));

        expect(invalid).toBe(false);
        expect(typeError).toBe(false);

    });

});
