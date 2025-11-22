import { Err } from "inferred-types";
import { RuntimeToken } from "~";


export type FromToken<T extends string> = T extends RuntimeToken
? 
: Err<
    `invalid-token`, 
    `FromToken<T> received a type which is NOT a RuntimeToken: ${T}`
>;
