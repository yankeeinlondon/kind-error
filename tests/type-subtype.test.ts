import { Equal, Expect } from "@type-challenges/utils";
import { createKindError } from "src";
import { describe, expect, it } from "vitest";

describe("type-subtypes in Kind Errors", () => {

  it("happy path", () => {
    const FooBar = createKindError("Foo/Bar");
    const foobar = createKindError("foo/bar");

    type Name = typeof FooBar["name"];
    type Kind = typeof FooBar["kind"];
    type Type = typeof FooBar["type"];
    type SubType = typeof FooBar["subType"];

    expect(FooBar.type).toBe("foo");
    expect(FooBar.subType).toBe("bar");

    type Name2 = typeof foobar["name"];
    type Kind2 = typeof foobar["kind"];
    type Type2 = typeof foobar["type"];
    type SubType2 = typeof foobar["subType"];

    expect(foobar.type).toBe("foo");
    expect(foobar.subType).toBe("bar");
    
    type cases = [
        Expect<Equal<Name, "FooBar">>,
        Expect<Equal<Kind, "foo/bar">>,
        Expect<Equal<Type, "foo">>,
        Expect<Equal<SubType, "bar">>,
        
        Expect<Equal<Name2, "FooBar">>,
        Expect<Equal<Kind2, "foo/bar">>,
        Expect<Equal<Type2, "foo">>,
        Expect<Equal<SubType2, "bar">>,
        ];
  });

  
  it("no subtype available", () => {
    const Foo = createKindError("Foo");

    type Kind = typeof Foo["kind"];
    type Type = typeof Foo["type"];
    type SubType = typeof Foo["subType"];

    expect(Foo.type).toBe("foo");
    expect(Foo.subType).toBe(undefined);
    
    type cases = [
        Expect<Equal<Kind, "foo">>,
        Expect<Equal<Type, "foo">>,
        Expect<Equal<SubType, undefined>>,
    ];
  });

  
  it("tertiary type is ignored", () => {
    const FooBarBaz = createKindError("Foo/Bar/Baz");

    type Kind = typeof FooBarBaz["kind"];
    type Type = typeof FooBarBaz["type"];
    type SubType = typeof FooBarBaz["subType"];
    
    type cases = [
        Expect<Equal<Kind, "foo/bar/baz">>,
        Expect<Equal<Type, "foo">>,
        Expect<Equal<SubType, "bar">>,    
    ];
  });
  
  
});
