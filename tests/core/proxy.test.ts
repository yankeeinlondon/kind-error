
import { describe, it, expect } from "vitest";
import { createKindError } from "~/createKindError";
import { isKindError } from "~/type-guards";

describe("KindErrorType.proxy()", () => {
    const MyError = createKindError("my-error", {
        required: t => t.string(),
        optional: t => t.optString(),
    });

    it("should proxy a standard Error object", () => {
        const originalError = new Error("Something went wrong");
        const proxied = MyError.proxy(originalError, { required: "foo" });

        expect(isKindError(proxied)).toBe(true);
        expect(proxied.kind).toBe("my-error");
        expect(proxied.message).toBe("Something went wrong");
        expect(proxied.required).toBe("foo");
        expect(proxied.underlying).toBe(originalError);
    });

    it("should allow partial props if context requires them", () => {
        const originalError = new Error("oops");
        // @ts-expect-error - missing required prop
        const invalid = MyError.proxy(originalError, {}); // TODO: look into this outcome

        const valid = MyError.proxy(originalError, { required: "bar" });
        expect(valid.required).toBe("bar");
    });

    it("should respect existing KindError", () => {
        const ke = MyError("original", { required: "got-it" });
        const proxied = MyError.proxy(ke, { required: "ignored" });

        expect(proxied).toBe(ke);
        expect(proxied.required).toBe("got-it");
    });

    it("should handle plain objects as errors", () => {
        const obj = { message: "failed", code: 123 };
        const proxied = MyError.proxy(obj, { required: "obj-test" });

        expect(proxied.message).toBe("failed");
        expect(proxied.underlying).toBe(obj);
    });
});
