import { asError } from "./asError";
import { asKindType } from "./asKindType";
import { Dictionary, isNumber, Mutable, ExpandRecursively, omitKeys } from 'inferred-types';
import { asKindSubType } from "./asKindSubtype";
import { getStackTrace } from "./getStackTrace";
import { KindError } from "~/types";

export function asKindError<
    const T extends { kind: string; message: string; code?: number; [key: string]: unknown}
>(
    obj: T
) {
    const err = asError(obj) as Dictionary & Error;
    err.__kind = "KindError";
    err.type = asKindType(obj.kind);
    err.subType = asKindSubType(obj.kind);
    if(isNumber(obj.code)) {
        err.code = obj.code
    }
    err.stackTrace = getStackTrace();
    const leftover = obj as Dictionary;
    
    for (const k of Object.keys(leftover)) {
        err[k] = leftover[k]
    }
    

    return err as unknown as KindError<T["kind"], T["message"], ExpandRecursively<Omit<Mutable<T>, "kind" | "message">>>
}
