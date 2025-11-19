import { describe, expect, it } from "vitest";
import {
    AssertEqual,
    Expect,
    AssertError
} from "inferred-types/types";
import { 
    createKindError, 
    isKindErrorType, 
    KindError, 
    KindErrorShape, 
    KindErrorType 
} from "~";
import { AssertExtends, EmptyObject } from "inferred-types";

describe("Defining Error Types", () => {

    describe("Invalid Definitions", () => {

        it("invalid character in name", () => {
            const t1 = createKindError("my>error", {});
            const t2 = createKindError("my[error]", {});

            expect(t1 instanceof Error).toBe(true);
            expect(t2 instanceof Error).toBe(true);

            type cases = [
                Expect<AssertError<typeof t1>>,
                Expect<AssertError<typeof t2>>,
            ];
        });
    })

    describe("Basics", () => {


        it("no context schema", () => {
            // because no context schema defined, this makes it 
            // flexible; allowing any KV value but with nothing
            // required
            const MyError = createKindError("my-error");

            expect(typeof MyError).toBe("function");
            expect(MyError.__kind).toBe("KindErrorType");
            expect(MyError.errorName).toBe("MyError");
            expect(MyError.type).toBe("my-error");
            expect(MyError.subType).toBe(undefined);
            expect(typeof MyError.is).toBe("function");
            expect(typeof MyError.partial).toBe("function");
            expect(typeof MyError.proxy).toBe("function");
            expect(MyError.context).toEqual({});

            expect(isKindErrorType(MyError)).toBe(true);

            type Params = Parameters<typeof MyError>;
            type Rtn = ReturnType<typeof MyError>;

            type cases = [
                Expect<AssertEqual<
                    Params,
                    [msg: string, ctx?: Record<string,unknown>]
                >>,
                Expect<AssertExtends<Rtn, KindErrorShape>>,
                Expect<AssertExtends<Rtn, KindError>>,
            ];
        });


        it("literal context, nothing required, nothing optional", () => {
            // a schema with ONLY a NonVariant KV defined means
            // that this property will persist but that no other KV's
            // are expected to be added when instantiated.
            const MyError = createKindError("my-error", { test: true });

            expect(typeof MyError).toBe("function");
            expect(MyError.__kind).toBe("KindErrorType");
            expect(MyError.errorName).toBe("MyError");
            expect(MyError.type).toBe("my-error");
            expect(MyError.subType).toBe(undefined);
            expect(typeof MyError.is).toBe("function");
            expect(typeof MyError.partial).toBe("function");
            expect(typeof MyError.proxy).toBe("function");
            expect(MyError.context).toEqual({ test: true });

            // the type of the ErrorKindType
            type Kind = typeof MyError;
            // the parameters which this type produces
            type Params = Parameters<Kind>;
            // the return type of this type
            type Rtn = ReturnType<Kind>;

            type cases = [
                Expect<AssertEqual<Params, [msg: string, ctx?: EmptyObject]>>,
                Expect<AssertEqual<Kind["kind"], "my-error">>,
                Expect<AssertEqual<Kind["context"], { test: true }>>,
                Expect<AssertExtends<Rtn,KindErrorShape>>,
                Expect<AssertExtends<Rtn,KindError>>,
            ];
        });

        it("literal context, nothing required, foo optional", () => {
            const MyError = createKindError("my-error", {
                test: true,
                foo: "string | undefined"
            });

            expect(typeof MyError).toBe("function");
            expect(MyError.__kind).toBe("KindErrorType");
            expect(MyError.errorName).toBe("MyError");
            expect(MyError.type).toBe("my-error");
            expect(MyError.subType).toBe(undefined);
            expect(typeof MyError.is).toBe("function");
            expect(typeof MyError.partial).toBe("function");
            expect(typeof MyError.proxy).toBe("function");
            expect(MyError.context).toEqual({ test: true, foo: "string | undefined"});

            type Kind = typeof MyError;
            type Params = Parameters<Kind>;
            type Rtn = ReturnType<Kind>;

            type cases = [
                Expect<AssertEqual<Kind["kind"], "my-error">>,
                Expect<AssertEqual<Kind["context"], { test: true, foo: string | undefined }>>,
                Expect<AssertEqual<
                    Params,
                    [msg: string, ctx?: { foo?: string }]
                >>,
                Expect<AssertExtends<Rtn, KindErrorShape>>,
                Expect<AssertExtends<Rtn, KindError>>,
            ];
        });

        it("literal context, foo required, nothing optional", () => {
            const MyError = createKindError("my-error", {
                test: true,
                foo: "string"
            });

            expect(typeof MyError).toBe("function");
            expect(MyError.__kind).toBe("KindErrorType");
            expect(MyError.type).toBe("my-error");
            expect(MyError.subType).toBe(undefined);
            expect(typeof MyError.is).toBe("function");
            expect(typeof MyError.partial).toBe("function");
            expect(typeof MyError.proxy).toBe("function");
            expect(MyError.context).toEqual({ test: true, foo: "string"});
            
            type Kind = typeof MyError;
            type Params = Parameters<Kind>;
            type Rtn = ReturnType<Kind>;

            type cases = [
                Expect<AssertEqual<Kind["kind"], "my-error">>,
                Expect<AssertEqual<Kind["context"], { test: true; foo: string }>>,
                Expect<AssertEqual<
                    Params,
                    [msg: string, ctx: { foo: string }]
                >>,
                Expect<AssertExtends<Rtn, KindErrorShape>>,
                Expect<AssertExtends<Rtn, KindError>>,
            ];
        });
    })

});
