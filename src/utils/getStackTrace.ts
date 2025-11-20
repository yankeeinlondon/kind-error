import { isString } from "inferred-types";
import type { KindStackItem } from "~/types";
import { toStackTrace } from "./toStackTrace";

export type GetStackTraceOptions = {
  /**
   * An error or object with a JS `stack` string
   */
  obj?: { stack: string; [key: string]: unknown } | Error | undefined;
  /**
   * Skip the given number of stack items at the top of the stack.
   *
   * **Note:** if no existing stack in `obj` was passed in we will
   * immediately pop off the first item of the new stack we create
   * to avoid the `getStackTrace()` function from appearing in the call
   * stack.
   */
  skip?: number;
};

/**
 * **getStackTrace**`(opt)`
 * 
 * Get's a structured stack trace. Allowing optionally:
 * 
 * - an existing object with a stack trace string to be used 
 * - skip a specified number of frames at the top  of the stack
 */
export function getStackTrace<T extends GetStackTraceOptions>(
  opt?: T,
): KindStackItem[] {
  let stack: string;
  // if we are capturing the stack we need to peel off the frame
  // from this function
  let offset = 1;

  if (opt?.obj && isString(opt.obj.stack) && opt.obj.stack !== "") {
    stack = opt.obj.stack;
    offset = 0;
  }
  else {
    stack = new Error("Stack Trace").stack || "";
  }

  const userSkip = opt?.skip || 0;

  return toStackTrace(stack, userSkip + offset);
}
