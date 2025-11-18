import { describe, expect, it } from "vitest";
import {
    AssertEqual,
    Expect,
    AssertError
} from "inferred-types/types";
import { createKindError, KindErrorType } from "~";

describe("Defining Error Types", () => {

    describe("Invalid Definitions", () => {
        
        it("invalid character", () => {
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

    describe("Parameters", () => {
        
        it("literal context, nothing required, nothing optional", () => {

            const MyError = createKindError("my-error", { test: true });

            expect(typeof MyError).toBe("function");
            expect(MyError.__kind).toBe("KindErrorType");
    
            type Params = Parameters<typeof MyError>;
    
            type cases = [
                Expect<AssertEqual<
                    typeof MyError,
                    KindErrorType<"my-error", { test: true }>
                >>,
                Expect<AssertEqual<Params, [msg: string]>>
            ];
        });
    
        it("literal context, nothing required, foo optional", () => {
            const MyError = createKindError("my-error", {
                test: true,
                foo: "string | undefined"
            });

            expect(typeof MyError).toBe("function");
            expect(MyError.__kind).toBe("KindErrorType");
            expect(MyError.errorName).toBe("MyError")
    
            type Params = Parameters<typeof MyError>;
    
            type cases = [
                Expect<AssertEqual<
                    typeof MyError,
                    KindErrorType<"my-error", { test: true, foo: string | undefined }>
                >>,
                Expect<AssertEqual<
                    Params, 
                    [msg: string, ctx?: { foo?: string | undefined }]
                >>
            ];
        });
    
        it("literal context, foo required, nothing optional", () => {
            const MyError = createKindError("my-error", {
                test: true,
                foo: "string"
            });

            expect(typeof MyError).toBe("function");
            expect(MyError.__kind).toBe("KindErrorType");
    
            type Params = Parameters<typeof MyError>;
    
            type cases = [
                Expect<AssertEqual<
                    typeof MyError,
                    KindErrorType<"my-error", { test: true; foo: string }>
                >>,
                Expect<AssertEqual<
                    Params,
                    [msg: string, ctx: { foo: string }]
                >>
            ];
        });
    })

});
