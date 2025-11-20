import { asError } from "./asError";
import { asKindType } from "./asKindType";
import { Dictionary } from "inferred-types";
import { asKindSubType } from "./asKindSubtype";

export function asKindError<
    T extends { kind: string; message: string; code?: number; [key: string]: unknown}
>(
    obj: T
) {
    const err = asError(obj) as Dictionary;
    err.type = asKindType(obj.kind);
    err.subType = asKindSubType(obj.kind);
    
}
