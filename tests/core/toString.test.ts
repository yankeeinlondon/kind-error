import { describe, expect, it } from "vitest";
import { createKindError } from "~";

describe("KindError toString()", () => {
    it("produces expected output structure", () => {
        const MyError = createKindError("my-error", { foo: "string" });
        const err = MyError("Something went wrong", { foo: "bar" });
        const str = err.toString();
        
        // console.log(str); 

        expect(str).toContain("MyError Error: Something went wrong");
        expect(str).toContain("Context:");
        expect(str).toContain("foo:");
        expect(str).toContain("bar");
        
        // Check for stack trace elements
        // We expect file links which usually look like /path/to/file:line:col
        // The stack trace should include this test file
        expect(str).toContain("tests/core/toString.test.ts");
    });
});
