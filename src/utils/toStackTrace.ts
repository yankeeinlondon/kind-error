import { KindStackItem } from "~/types";

/**
 * converts a normal Javascript _stack_ string into a structured 
 * stack trace.
 */
export function toStackTrace<T extends string>(stack: T): KindStackItem[] {
    // TODO
}
