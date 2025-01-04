import type { Equal, Expect } from "@type-challenges/utils";
import type {
  EmptyObject,
  Narrowable,
} from "inferred-types";
import type { KindError, KindErrorType } from "../src";
import { describe, expect, it } from "vitest";
import { createKindError } from "../src/kindError";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("kindError", () => {
  it("no base context", () => {
    const FooBar = createKindError("foo-bar");
    const err = FooBar("oh my!");

    expect(err.name).toEqual("FooBar");
    expect(err.kind).toEqual("foo-bar");
    expect(err.__kind).toEqual("KindError");

    expect(err.context).toEqual({});

    type cases = [
      Expect<
        Equal<
          typeof FooBar,
          KindErrorType<"foo-bar", Record<string, Narrowable>>
        >
      >,
      Expect<Equal<typeof err, KindError<"FooBar", EmptyObject>>>,
      Expect<Equal<(typeof err)["kind"], "foo-bar">>,
      Expect<Equal<(typeof err)["name"], "FooBar">>,
    ];
  });

  it("rebasing", () => {
    const FooBar = createKindError("foo-bar", { bar: true });
    const FB = FooBar.rebase({ foo: 1 });
    const err1a = FooBar("oh my!");
    const err2a = FooBar("oh my!", {});

    const err1b = FB("oh my!");
    const err2b = FB("oh my!", {});

    expect(err1a.name).toEqual("FooBar");
    expect(err1a.kind).toEqual("foo-bar");
    expect(err1a.__kind).toEqual("KindError");
    expect(err1a.context).toEqual({ bar: true });
    expect(err2a.context).toEqual({ bar: true });

    expect(err1b.context).toEqual({ foo: 1, bar: true });
    expect(err2b.context).toEqual({ foo: 1, bar: true });

    type cases = [
      Expect<Equal<typeof FooBar, KindErrorType<"FooBar", { bar: true }>>>,
      Expect<Equal<typeof FB, KindErrorType<"FooBar", { foo: 1; bar: true }>>>,
      Expect<Equal<typeof err1a, KindError<"FooBar", { bar: true }>>>,
      Expect<Equal<typeof err2a, KindError<"FooBar", { bar: true }>>>,
      Expect<Equal<typeof err1b, KindError<"FooBar", { foo: 1; bar: true }>>>,
      Expect<Equal<typeof err2b, KindError<"FooBar", { foo: 1; bar: true }>>>,
    ];
  });

  it("with non-conflicting base context", () => {
    const err = createKindError("foo-bar", { foo: 42 });
    const fooBar = err("oh my!", { bar: 55 });

    expect(fooBar.name).toEqual("FooBar");
    expect(fooBar.kind).toEqual("foo-bar");
    expect(fooBar.__kind).toEqual("KindError");

    expect(fooBar.context).toEqual({ foo: 42, bar: 55 });

    type cases = [
      Expect<Equal<typeof err, KindErrorType<"FooBar", { foo: 42 }>>>,
      Expect<Equal<typeof fooBar, KindError<"FooBar", { foo: 42; bar: 55 }>>>,
      Expect<Equal<(typeof fooBar)["kind"], "foo-bar">>,
      Expect<Equal<(typeof fooBar)["name"], "FooBar">>,
    ];
  });

  it("with conflicting base context", () => {
    const err = createKindError("foo-bar", { foo: 42 });
    const fooBar = err("oh my!", { foo: 1, bar: 55 });

    expect(fooBar.name).toEqual("FooBar");
    expect(fooBar.kind).toEqual("foo-bar");
    expect(fooBar.__kind).toEqual("KindError");

    expect(fooBar.context).toEqual({ foo: 1, bar: 55 });

    // @ts-ignore
    type _cases = [
      Expect<Equal<typeof err, KindErrorType<"FooBar", { foo: 42 }>>>,
      Expect<Equal<typeof fooBar, KindError<"FooBar", { foo: 1; bar: 55 }>>>,
      Expect<Equal<(typeof fooBar)["kind"], "foo-bar">>,
      Expect<Equal<(typeof fooBar)["name"], "FooBar">>,
    ];
  });

  it("with awkward name", () => {
    const err = createKindError("FooBar<Baz>");
    const fooBarBaz = err("well, well");

    expect(fooBarBaz.kind).toBe("foo-bar-baz");
    expect(fooBarBaz.name).toBe("FooBarBaz");

    expect(fooBarBaz.name).toEqual("FooBarBaz");
    expect(fooBarBaz.kind).toEqual("foo-bar-baz");

    type cases = [
      Expect<Equal<typeof fooBarBaz, KindError<"FooBarBaz", EmptyObject>>>, //
    ];
  });
});
