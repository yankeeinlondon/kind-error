import { asError } from "./asError";
import { asKindType } from "./asKindType";
import { Dictionary, isNumber } from "inferred-types";
import { asKindSubType } from "./asKindSubtype";
import { getStackTrace } from "./getStackTrace";
import { KindError } from "~/types";

export function asKindError<
    T extends { kind: string; message: string; code?: number; [key: string]: unknown}
>(
    obj: T
) {
    const err = asError(obj) as Dictionary;
    err.type = asKindType(obj.kind);
    err.subType = asKindSubType(obj.kind);
    if(isNumber(obj.code)) {
        err.code = obj.code
    }
    err.stackTrace = getStackTrace();

    return {
        __kind: "KindError",
        ...err
    } as KindError<T["kind"], T["message"], Omit<T, "kind" | "message">>
}
