import { isString, Never } from "inferred-types";
import { KindStackItem } from "~/types";
import { toStackTrace } from "./toStackTrace";

export function getStackTrace(): KindStackItem[] {
    const {stack} = new Error();

    return isString(stack)
        ? toStackTrace(stack)
        : Never
}
