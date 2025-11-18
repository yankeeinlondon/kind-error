import type { Equal, Expect } from "@type-challenges/utils";
import { createKindError } from "~";
import { describe, expect, it } from "vitest";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("kindErrorType.is()", () => {
  const Invalid = createKindError("Invalid");
  const BadJuju = createKindError("BadJuju", { foo: false });

  it("happy path", () => {
    const i1 = Invalid("Hey there");
    const i2 = Invalid("my my");

    const j1 = BadJuju("Hey there");
    const j2 = BadJuju("my my");

    const t1 = Invalid.is(i1);
    const t2 = Invalid.is(i2);
    const t3 = BadJuju.is(j1);
    const t4 = BadJuju.is(j2);

    const f1 = BadJuju.is(i1);
    const f2 = BadJuju.is(i2);
    const f3 = Invalid.is(j1);
    const f4 = Invalid.is(j2);

    expect(t1, `Invalid type has kind "${Invalid?.kind}", i1 has kind of "${i1.kind}"`).toBe(true);
    expect(t2).toBe(true);
    expect(t3, `j1 kind "${j1.kind}"`).toBe(true);
    expect(t4).toBe(true);

    expect(f1).toBe(false);
    expect(f2).toBe(false);
    expect(f3).toBe(false);
    expect(f4).toBe(false);
  });

  it("union type isolated", () => {
    const _i1 = Invalid("Hey there");
    const _j1 = BadJuju("Hey there");

    const a = null as unknown as typeof _i1 | typeof _j1;

    if (Invalid.is(a)) {
      type A = typeof a;

      type cases = [
        Expect<Equal<A, typeof _i1>>,
      ];
    }
    else {
      type A = typeof a;

      type cases = [
        Expect<Equal<A, typeof _j1>>,
      ];
    }
  });

  it("unknown type as input", () => {
    const a = null as unknown;

    if (Invalid.is(a)) {
      type A = typeof a;

      type cases = [
        Expect<Equal<A, typeof Invalid.errorType>>,
      ];
    }
    else {
      type A = typeof a;

      type cases = [
        Expect<Equal<A, unknown>>,
      ];
    }
  });
});
