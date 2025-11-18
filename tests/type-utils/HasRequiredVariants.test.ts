import { describe, it } from "vitest";
import { HasRequiredVariants } from "src";
import { Expect, AssertFalse, AssertTrue, EmptyObject } from "inferred-types";

describe("HasRequiredVariants<TContext>", () => {

    it("empty context", () => {
        type T = HasRequiredVariants<EmptyObject>;

        type cases = [
            Expect<AssertFalse<T>>,
        ];
    });

    it("only literal values; no variants", () => {
        type T = HasRequiredVariants<{ test: true; answer: 42 }>;

        type cases = [
            Expect<AssertFalse<T>>,
        ];
    });

    it("singular variant", () => {
        type T = HasRequiredVariants<{ test: boolean }>;

        type cases = [
            Expect<AssertTrue<T>>,
        ];
    });

    it("required variant with optional", () => {
        type T = HasRequiredVariants<{ test: boolean; answer: 42 | undefined }>;

        type cases = [
            Expect<AssertTrue<T>>,
        ];
    });

    it("just an optional variant", () => {
        type T = HasRequiredVariants<{ answer: 42 | undefined }>;

        type cases = [
            Expect<AssertFalse<T>>,
        ];
    });

});
