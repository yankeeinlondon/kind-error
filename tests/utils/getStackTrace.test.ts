import { describe, it, expect } from "vitest";
import { getStackTrace } from "~/utils/getStackTrace";
import type { Expect, AssertEqual } from "inferred-types/types";
import type { KindStackItem } from "~/types";

describe("getStackTrace(opt)", () => {
  it("should capture current stack trace when no object provided", () => {
    const result = getStackTrace();

    expect(result.length).toBeGreaterThan(0);
    // The first frame should NOT be getStackTrace itself
    expect(result[0].function).not.toBe("getStackTrace");
    // It should likely be this test function (anonymous or part of vitest)
  });

  it("should use provided error object stack", () => {
    const err = new Error("Test Error");
    const result = getStackTrace({ obj: err });

    expect(result.length).toBeGreaterThan(0);
    // Verify it parsed the error's stack
  });

  it("should skip frames correctly with captured stack", () => {
    const resultNoSkip = getStackTrace();
    const resultSkip1 = getStackTrace({ skip: 1 });

    // Because stack traces are dynamic, exact comparison is hard, 
    // but resultSkip1[0] should roughly match resultNoSkip[1] 
    // (assuming the calls happened in same context, though line numbers differ)
    
    // Better check: call from a helper function
    function helper() {
        return getStackTrace({ skip: 1 });
    }
    const result = helper();
    // helper should be skipped, so we see this test function
    expect(result[0].function).not.toBe("helper");
  });

  it("should skip frames correctly with provided object", () => {
    const mockStack = `Error: Test
    at top (file.ts:1:1)
    at middle (file.ts:2:1)
    at bottom (file.ts:3:1)`;
    
    const err = { stack: mockStack };
    const result = getStackTrace({ obj: err, skip: 1 });

    expect(result).toHaveLength(2);
    expect(result[0].function).toBe("middle");
  });
});
