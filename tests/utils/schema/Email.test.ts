
import { describe, expect, it } from "vitest";
import {
    AssertEqual,
    Expect,
} from "inferred-types";
import { COMMA_DELIMITER, schemaProp, TOKEN_END, TOKEN_START } from "~/utils";
import {  isRuntimeTokenCallback } from "~";

describe("Email", () => {

    it("no params", () => {
        const email = schemaProp(t => t.email());

        expect(isRuntimeTokenCallback(email)).toBe(true);
        if(isRuntimeTokenCallback(email)) {
            expect(email()).toBe(`${TOKEN_START}email${TOKEN_END}`)
        }

        type cases = [
            Expect<AssertEqual<typeof email, `${string}@${string}.${string}`>>
        ];
    });

    it("single domain email", () => {
        const email = schemaProp(t => t.email("microsoft.com"));

        expect(isRuntimeTokenCallback(email)).toBe(true);
        if(isRuntimeTokenCallback(email)) {
            expect(email()).toBe(`${TOKEN_START}email::microsoft.com${TOKEN_END}`)
        }

        type cases = [
            Expect<AssertEqual<typeof email, `${string}@microsoft.com`>>
        ];
    });

    it("multi domain email", () => {
        const email = schemaProp(t => t.email("microsoft.com", "google.com"));

        expect(isRuntimeTokenCallback(email)).toBe(true);
        if(isRuntimeTokenCallback(email)) {
            expect(email()).toBe(`${TOKEN_START}email::microsoft.com${COMMA_DELIMITER}google.com${TOKEN_END}`)
        }

        type cases = [
            Expect<AssertEqual<typeof email, `${string}@microsoft.com` | `${string}@google.com`>>
        ];
    });    

    
    it("pattern based", () => {
        const email = schemaProp(t => t.email(e => e.endsWith("microsoft.com")));

        expect(isRuntimeTokenCallback(email)).toBe(true);
        if(isRuntimeTokenCallback(email)) {
            expect(email()).toBe(`${TOKEN_START}email::${TOKEN_START}endsWith::microsoft.com${TOKEN_END}${TOKEN_END}`)
        }
    
        type cases = [
            Expect<AssertEqual<typeof email, `${string}@${string}microsoft.com`>>
        ];
    });
});
