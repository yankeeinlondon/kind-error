import type { Equal, Expect } from "@type-challenges/utils";
import type { EmptyObject, Narrowable } from "inferred-types";
import type { KindError, KindErrorDefn } from "../src";
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

    type _cases = [
      Expect<
        Equal<
          typeof FooBar,
          KindErrorDefn<"foo-bar", Record<string, Narrowable>>
        >
      >,
      Expect<Equal<typeof err, KindError<"FooBar", EmptyObject>>>,
      Expect<Equal<(typeof err)["kind"], "foo-bar">>,
      Expect<Equal<(typeof err)["name"], "FooBar">>,
    ];
  });

  it("with non-conflicting base context", () => {
    const err = createKindError("foo-bar", { foo: 42 });
    const fooBar = err("oh my!", { bar: 55 });

    expect(fooBar.name).toEqual("FooBar");
    expect(fooBar.kind).toEqual("foo-bar");
    expect(fooBar.__kind).toEqual("KindError");

    expect(fooBar.context).toEqual({ foo: 42, bar: 55 });

    type _cases = [
      Expect<Equal<typeof err, KindErrorDefn<"Foobar", { foo: 42 }>>>,
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

    type _cases = [
      Expect<Equal<typeof err, KindErrorDefn<"FooBar", { foo: 42 }>>>,
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

    type _cases = [
      Expect<Equal<typeof fooBarBaz, KindError<"FooBarBaz", EmptyObject>>>, //
    ];
  });
});
