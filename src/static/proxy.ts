import { isDictionary, isNumber, isString } from "inferred-types";
import type { EmptyObject } from "inferred-types"
import { 
    isAwsLambdaError, 
    isAxiosError, 
    isError, 
    isFetchResponse, 
    isKindError 
} from "~/type-guards";
import { KindErrorTypeContext, HasRequiredVariants } from "~/types";
import { KindError } from '../types/KindError';



/** 
 * **proxyFn**`(name, schema) -> (errLike, [fallbackMsg]) -> KindError`
 * 
 * Higher order function which receives:
 * 
 * - context in name/kind, and the schema
 * - returns the signature and implementation for the `KindErrorType`'s 
 * **proxy** function.
 */
export function proxyFn<
    TName extends string, 
    const TSchema extends Record<string,unknown>
>(
    name: TName,
    schema: TSchema,
) {

    return <
        const TErr, 
        const TCtx extends HasRequiredVariants<TSchema> extends true
            ?  KindErrorTypeContext<TSchema> & { msgFallback?: string }
            : (KindErrorTypeContext<TSchema> & { msgFallback?: string }) | string | undefined
    >(
        errLike: TErr,
        context?: TCtx
    ) => {
        const ctx = (
            isString(context)
            ? { msgFallback: context }
            : context
        ) as KindErrorTypeContext<TSchema> & { msgFallback?: string };

        if(isKindError(errLike)) {
            return errLike; // pass through as is
        }

        if (isAxiosError(errLike)) {

        }

        if (isAwsLambdaError(errLike)) {

        }

        if (isFetchResponse(errLike)) {

        }

        if (isError(errLike)) {

        }

        if (isDictionary(errLike)) {
            const message = isString(errLike?.message)
                ? errLike.message
                : isString(errLike?.errmsg)
                ? errLike.errmsg
                : isString(errLike.errorMessage)
                ? errLike.errorMessage
                : isString(errLike.info)
                ? errLike.info
                : isString(errLike.hint)
                ? errLike.hint
                : isString(ctx?.msgFallback)
                ? ctx.msgFallback
                : `Unknown error (see underlying property): ${String(errLike)}`;
            const code = isNumber(errLike?.code)
                ? errLike.code
                : isNumber(errLike?.errorCode)
                ? errLike.errorCode
                : isNumber(errLike?.statusCode)
                ? errLike.statusCode
                : null;


            return (
                isNumber(code)
                    ? {
                        __kind: "KindError",
                        kind: name,

                    }
            )
        }

    }

}
