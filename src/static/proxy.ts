import { indexOf, isDictionary, isNumber, isString } from "inferred-types";
import {
    isAwsLambdaError,
    isAxiosError,
    isError,
    isFetchResponse,
    isKindError
} from "~/type-guards";
import { KindErrorTypeContext, HasRequiredVariants } from "~/types";
import { asKindError, removeVariants } from "~/utils";

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
    const TSchema extends Record<string, unknown>
>(
    kind: TName,
    schema: TSchema, // TODO: we need to incorporate this into the results
) {
    const schemaKeyValue = removeVariants(schema);

    return <
        const TErr,
        const TCtx extends HasRequiredVariants<TSchema> extends true
        ? KindErrorTypeContext<TSchema> & { msgFallback?: string }
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

        if (isKindError(errLike)) {
            return errLike; // pass through as is
        }

        if (isAxiosError(errLike)) {
            return asKindError({
                kind,
                message: errLike.message,
                code: errLike.response?.status || 0,
                underlying: errLike,
                ...schemaKeyValue
            })
        }

        if (isAwsLambdaError(errLike)) {
            return asKindError({
                kind,
                message: errLike.errorMessage,
                cause: `AWS Lambda returned an error`,
                underlying: errLike,
                ...schemaKeyValue
            })

        }

        if (isFetchResponse(errLike)) {
            return asKindError({
                kind,
                message: `fetch request returned an error while trying to reach${errLike.url}`,
                code: errLike.status,
                underlying: errLike,
                ...schemaKeyValue
            })
        }


        if (isError(errLike)) {
            return asKindError({
                kind,
                message: errLike.message === ""
                    ? ctx.msgFallback || `Unknown error (${errLike.name})`
                    : errLike.message,
                ...(
                    isNumber(isNumber(indexOf(errLike, "code")))
                        ? { code: indexOf(errLike, "code") as number }
                        : {}
                ),
                underlying: errLike,
                ...schemaKeyValue
            })
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
                        : isNumber(errLike?.status)
                            ? errLike.status
                            : null;


            return (
                isNumber(code)
                    ? asKindError({
                        kind,
                        message,
                        code,
                        underlying: errLike,
                        ...schemaKeyValue
                    })
                    : asKindError({
                        kind,
                        message,
                        underlying: errLike,
                        ...schemaKeyValue
                    })
            )
        }

        if (isString(errLike)) {
            return asKindError({
                kind,
                message: errLike,
                ...schemaKeyValue
            })
        }

        return asKindError({
            kind,
            message: `Unknown error (see underlying property): ${String(errLike)}`,
            underlying: errLike,
            ...schemaKeyValue
        })

    }

}
