
import { describe, expect, it } from "vitest";
import {
    AssertEqual,
    Expect,
} from "inferred-types/types";
import { schemaProp } from "~/utils";
import { isRuntimeToken } from "~";

describe("Email", () => {

    it("no params", () => {
        const email = schemaProp(t => t.email());

        expect(isRuntimeToken(email)).toBe(true);
        if(isRuntimeToken(email)) {
            expect(email()).toBe("<<email>>")
        }

        type cases = [
            Expect<AssertEqual<typeof email, `${string}@${string}.${string}`>>
        ];
    });

    it("single domain email", () => {
        const email = schemaProp(t => t.email("microsoft.com"));

        expect(isRuntimeToken(email)).toBe(true);
        if(isRuntimeToken(email)) {
            expect(email()).toBe("<<email::microsoft.com>>")
        }

        type cases = [
            Expect<AssertEqual<typeof email, `${string}@microsoft.com`>>
        ];
    });

    it("multi domain email", () => {
        const email = schemaProp(t => t.email("microsoft.com", "google.com"));

        expect(isRuntimeToken(email)).toBe(true);
        if(isRuntimeToken(email)) {
            expect(email()).toBe("<<email::microsoft.com, google.com>>")
        }

        type cases = [
            Expect<AssertEqual<typeof email, `${string}@microsoft.com` | `${string}@google.com`>>
        ];
    });    

    
    it("pattern based", () => {
        const email = schemaProp(t => t.email(e => e.endsWith("microsoft.com")));

        expect(isRuntimeToken(email)).toBe(true);
        if(isRuntimeToken(email)) {
            expect(email()).toBe("<<email::{{String}}microsoft.com>>")
        }
    
        type cases = [
            Expect<AssertEqual<typeof email, `${string}@${string}microsoft.com`>>
        ];
    });
});
