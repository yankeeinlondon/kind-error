import type { Equal, Expect } from "@type-challenges/utils";
import type { Dictionary, EmptyObject, Narrowable } from "inferred-types";
import type { KindError } from "src";
import { createKindError, isKindError } from "src";
import { describe, expect, it } from "vitest";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("isKindError(val)", () => {
  const Invalid = createKindError("Invalid");
  const BadJuju = createKindError("BadJuju", { foo: false });

  it("base check", () => {
    const t1 = Invalid("uh oh", {});
    const t2 = BadJuju("run!");
    const t3 = Invalid("not this again!", { foo: true, bar: 2 });
    const t4 = BadJuju("not this again!", { foo: true, bar: 2 });

    expect(isKindError(t1)).toBe(true);
    expect(isKindError(t2)).toBe(true);
    expect(isKindError(t3)).toBe(true);
    expect(isKindError(t4)).toBe(true);

    expect(t1).toBeInstanceOf(Error);
    expect(t2).toBeInstanceOf(Error);
    expect(t3).toBeInstanceOf(Error);
    expect(t4).toBeInstanceOf(Error);
  });

  it("negative tests", () => {
    const f1 = isKindError(new Error("not kind!"));
    const f2 = isKindError({ message: "i am a fake" });

    expect(f1).toBe(false);
    expect(f2).toBe(false);
  });

  it("union negation", () => {
    const a = null as unknown as ReturnType<typeof Invalid> | [string, number];
    if (isKindError(a)) {
      type A = typeof a;

      type cases = [Expect<Equal<A, KindError<"Invalid", EmptyObject>>>];
    }
    else {
      type A = typeof a;

      type cases = [Expect<Equal<A, [string, number]>>];
    }
  });

  it("preserves specific context types", () => {
    const WithContext = createKindError("WithContext", { required: true });
    const err = WithContext("test", { optional: 42 });

    if (isKindError(err)) {
      type T = (typeof err)["context"];

      type cases = [
        Expect<
          Equal<
            T,
            Dictionary<string, Narrowable> & { required: true; optional: 42 }
          >
        >,
      ];
    }
  });

  it("handles union types in context", () => {
    const Union = createKindError("Union", {
      status: "success" as "success" | "failure",
    });
    const err = Union("test", { status: "failure" });

    if (isKindError(err)) {
      type T = (typeof err)["context"]["status"];

      type cases = [Expect<Equal<T, "failure">>];
    }
  });

  it("handles undefined context", () => {
    const Optional = createKindError("Optional");
    const err1 = Optional("test");
    const err2 = Optional("test", {});

    expect(isKindError(err1)).toBe(true);
    expect(isKindError(err2)).toBe(true);

    if (isKindError(err1)) {
      type T1 = (typeof err1)["context"];

      type cases = [Expect<Equal<T1, Dictionary<string, Narrowable>>>];
    }
  });

  it("handles rebase chaining", () => {
    const Base = createKindError("Base", { a: 1 });
    const Level1 = Base.rebase({ b: 2 });
    const Level2 = Level1.rebase({ c: 3 });

    const err = Level2("test");

    if (isKindError(err)) {
      type T = (typeof err)["context"];

      type cases = [
        Expect<Equal<T, Dictionary<string, Narrowable> & { a: 1; b: 2; c: 3 }>>,
      ];
    }
  });
});
