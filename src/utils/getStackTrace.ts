import { isString, Never } from "inferred-types";
import { KindStackItem } from "~/types";
import { toStackString } from "./toStackString";

export function getStackTrace(): KindStackItem[] {
    const {stack} = new Error();

    return isString(stack)
        ? toStackString(stack)
        : Never
}
