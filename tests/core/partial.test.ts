
import { describe, expect, it } from "vitest";
import {
    AssertEqual,
    Expect,
} from "inferred-types/types";
import { 
    createKindError, 
} from "~";

describe("KindErrorType.partial()", () => {

    it("Runtime & Type: basic partial application", () => {
        // Arrange
        const BaseErr = createKindError("my-error", {
            region: "string",
            code: "number",
            user: "string"
        });

        // Act
        // We expect this to return a new KindErrorType where region and code are fixed
        const SpecificErr = BaseErr.partial({ region: "us-east", code: 404 });
        
        // Instantiate the error
        const err = SpecificErr("not found", { user: "ken" });

        // Assert Runtime
        expect(SpecificErr.kind).toBe("my-error");
        expect(SpecificErr.schema).toEqual({
            region: "us-east",
            code: 404,
            user: "string" 
        });
        
        expect(err.kind).toBe("my-error");
        expect(err.region).toBe("us-east");
        expect(err.code).toBe(404);
        expect(err.user).toBe("ken");

        // Assert Types
        type SpecificParams = Parameters<typeof SpecificErr>;
        
        // Check that the resulting error has the correct context shape (all values resolved)
        type ErrContext = typeof err;

        type cases = [
            // The partial error type should require 'user' in its context
            Expect<AssertEqual<
                SpecificParams,
                [msg: string, ctx: { user: string }]
            >>,
            // The resulting error context should have literal values for region/code
            // and string for user
            Expect<AssertEqual<
                ErrContext["region"],
                "us-east"
            >>,
            Expect<AssertEqual<
                ErrContext["code"],
                404
            >>,
            Expect<AssertEqual<
                ErrContext["user"],
                "ken"
            >>
        ];
    });

    it("Runtime & Type: chained partial application", () => {
        // Arrange
        const BaseErr = createKindError("my-error", {
            region: "string",
            code: "number",
            user: "string"
        });

        // Act
        const Step1 = BaseErr.partial({ region: "us-west" });
        const Step2 = Step1.partial({ code: 500 });
        
        // Instantiate
        const err = Step2("server error", { user: "admin" });

        // Assert Runtime
        expect(Step2.schema).toEqual({
            region: "us-west",
            code: 500,
            user: "string"
        });

        expect(err.region).toBe("us-west");
        expect(err.code).toBe(500);
        expect(err.user).toBe("admin");

        // Assert Types
        type Step1Params = Parameters<typeof Step1>;
        type Step2Params = Parameters<typeof Step2>;
        
        type cases = [
            // Step1 still needs code and user
            Expect<AssertEqual<
                Step1Params,
                [msg: string, ctx: { code: number; user: string }]
            >>,
            // Step2 only needs user
            Expect<AssertEqual<
                Step2Params,
                [msg: string, ctx: { user: string }]
            >>,
            // Resulting error has everything
            Expect<AssertEqual<
                typeof err["region"],
                "us-west"
            >>,
            Expect<AssertEqual<
                typeof err["code"],
                500
            >>,
            Expect<AssertEqual<
                typeof err["user"],
                "admin"
            >>
        ];
    });

    it("Runtime & Type: partial with optional property", () => {
        // Arrange
        const BaseErr = createKindError("my-error", {
            req: "string",
            opt: "number|undefined"
        });

        // Act
        const FixedOpt = BaseErr.partial({ opt: 123 });
        const FixedReq = BaseErr.partial({ req: "hello" });

        // Assert Runtime
        // ... (omitted for brevity as we focus on types mostly here)
        
        // Assert Types
        type P1 = Parameters<typeof FixedOpt>;
        type P2 = Parameters<typeof FixedReq>;

        type cases = [
            // FixedOpt has opt fixed, so req is required
            Expect<AssertEqual<
                P1,
                [msg: string, ctx: { req: string }]
            >>,
            // FixedReq has req fixed, so opt is optional (ctx is optional)
            Expect<AssertEqual<
                P2,
                [msg: string, ctx?: { opt?: number }]
            >>
        ];
    });

});
