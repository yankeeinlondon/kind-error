import { Equal, Expect } from "@type-challenges/utils";
import { describe, expect, it } from "vitest";
import { Narrowable } from "inferred-types";
import { createKindError } from "../src/kindError";
import { KindError, KindErrorDefn } from "../src";

// Note: while type tests clearly fail visible inspection, they pass from Vitest
// standpoint so always be sure to run `tsc --noEmit` over your test files to
// gain validation that no new type vulnerabilities have cropped up.

describe("KindError", () => {
  it("no base context", () => {
    const FooBar = createKindError("foo-bar");
    const err = FooBar("oh my!");

    expect(err.name).toEqual("FooBar");
    expect(err.kind).toEqual("foo-bar");
    expect(err.__kind).toEqual("KindError");

    expect(err.context).toEqual({});

    // @ts-ignore
    type cases = [
      Expect<
        Equal<
          typeof FooBar,
          KindErrorDefn<"foo-bar", Record<string, Narrowable>>
        >
      >,
      Expect<Equal<typeof err, KindError<"foo-bar", {}>>>,
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

    // @ts-ignore
    type cases = [
      Expect<Equal<typeof err, KindErrorDefn<"foo-bar", { foo: 42 }>>>,
      Expect<Equal<typeof fooBar, KindError<"foo-bar", { foo: 42; bar: 55 }>>>,
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
    type cases = [
      Expect<Equal<typeof err, KindErrorDefn<"foo-bar", { foo: 42 }>>>,
      Expect<Equal<typeof fooBar, KindError<"foo-bar", { foo: 1; bar: 55 }>>>,
      Expect<Equal<(typeof fooBar)["kind"], "foo-bar">>,
      Expect<Equal<(typeof fooBar)["name"], "FooBar">>,
    ];
  });

  it("with awkward name", () => {
    const err = createKindError("FooBar<Baz>");
    const fooBarBaz = err("well, well");

    expect(fooBarBaz.name).toEqual("FooBar<Baz>");
    expect(fooBarBaz.kind).toEqual("foo-bar-baz");

    // @ts-ignore
    type cases = [Expect<Equal<typeof fooBarBaz, KindError<"FooBar<Baz>">>>];
  });
});
