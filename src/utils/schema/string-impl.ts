import { SchemaApi__String } from "~/types";
import { asToken } from "../asToken";
import { narrow, Suggest } from "inferred-types";



export const SCHEMA_API_STRING: SchemaApi__String = {
   string<T extends readonly string[]>(...literals: T) {
        return asToken(() => literals.length === 0 ? "string" : literals.join(" | ")) as unknown as [] extends T ? string : T[number];
    },

    optString<T extends readonly string[]>(...literals: T) {
        return asToken(() => literals.length === 0 ? "string | undefined" : `${literals.join(" | ")} | undefined`) as unknown as [] extends T ? string | undefined : T[number] | undefined;
    },

    startsWith<T extends readonly string[]>(...literals: T) {
        return asToken(
            () => `${literals.join(" | ")}{{String}}`
        ) as unknown as `${T[number]}${string}`;
    },

    endsWith<T extends readonly string[]>(...literals: T) {
        return asToken(
            () => `{{String}}${literals.join(" | ")}`
        ) as unknown as `${string}${T[number]}`;
    },

    suggest<T extends readonly string[]>(...suggestions: T) {
        return asToken(() => `Suggest<${suggestions.join(' | ')}>`) as unknown as [] extends T ? string : Suggest<T[number]>;
    }
} as const
