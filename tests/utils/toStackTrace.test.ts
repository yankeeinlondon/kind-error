import { describe, it, expect } from "vitest";
import { toStackTrace } from "~/utils/toStackTrace";
import type { Expect, AssertEqual } from "inferred-types/types";
import type { KindStackItem } from "~/types";

describe("toStackTrace(stack, skip)", () => {
  const mockStack = `Error: Something went wrong
    at third (file:///app/src/third.ts:30:10)
    at second (file:///app/src/second.ts:20:10)
    at first (file:///app/src/first.ts:10:10)
    at main (file:///app/src/main.ts:1:1)`;

  it("should parse a standard stack trace", () => {
    const result = toStackTrace(mockStack);

    expect(result).toHaveLength(4);
    expect(result[0].function).toBe("third");
    expect(result[3].function).toBe("main");

    type cases = [
      Expect<AssertEqual<typeof result, KindStackItem[]>>
    ];
  });

  it("should skip frames when 'skip' is provided", () => {
    const result = toStackTrace(mockStack, 2);

    expect(result).toHaveLength(2);
    expect(result[0].function).toBe("first");
    expect(result[1].function).toBe("main");
  });

  it("should handle skip larger than stack length", () => {
    const result = toStackTrace(mockStack, 10);
    expect(result).toHaveLength(0);
  });

  it("should filter out ignored paths", () => {
    const stackWithIgnored = `Error: Test
    at valid (file:///app/valid.ts:1:1)
    at node:internal/process:10:1
    at @vitest/runner/dist/index.js:5:5`;

    const result = toStackTrace(stackWithIgnored);
    expect(result).toHaveLength(1);
    expect(result[0].function).toBe("valid");
  });

  it("should return empty array for invalid input", () => {
    // @ts-ignore - Testing runtime behavior with invalid input
    const result = toStackTrace(null);
    expect(result).toEqual([]);
  });
});
