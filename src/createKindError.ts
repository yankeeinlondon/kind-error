import { 
    As,
    Contains,
    createFnWithProps,
    type Dictionary, 
    type EmptyObject, 
    err, 
    type Err,
    MergeObjects,
    toPascalCase
} from 'inferred-types';
import {  AsContext, KindError, KindErrorType, ParseContext } from '~/types';
import { asKindSubType, asKindType, getStackTrace } from '~/utils';
import { toStringFn } from './instance';
import { isKindError } from './type-guards';
import { proxyFn } from './static';

type Rtn<
    TName extends string, 
    TContext extends Dictionary<string>
> = Contains<TName, "<" | ">" | "[" | "]" | "(" | ")"> extends true
    ? Err<
        "invalid-name",
        `The name for a KindError must not include any of the following characters: "<", ">", "[", "]", "(", ")"`
    >
    : KindErrorType<TName, ParseContext<TContext>>;


/**
 * **createKindError**`(name, context)`
 * 
 * Creates a `KindErrorType` which can then be called to create
 * the underlying `KindError` instance.
 */
export function createKindError<
    const TName extends string,
    const TContext extends Dictionary<string>
>(
    name: TName,
    context: TContext = {} as EmptyObject as TContext
): Rtn<TName,TContext>  {
    if (/[<>\[\]\(\)]/.test(name)) {
        return err("invalid-name", `The name for a KindError must not include any of the following characters: "<", ">", "[", "]", "(", ")"`) as Rtn<TName,TContext>
    }
    const props = {
        __kind: "KindErrorType",
        kind: name,
        errorName: toPascalCase(name),
        type: asKindType(name),
        subType: asKindSubType(name),
        context,

        proxy<E, M extends string>(e: E, msg?: M) {
            return (
                isKindError(e)
                    ? e
                    : proxyFn(name, msg || "", context)
            ) as KindError<TName, string, TContext>
        },

        partial<C extends AsContext<TContext>>(ctx: C) {
            return createKindError(name, {...context, ...ctx} as MergeObjects<TContext,C>);
        },

        is(val: unknown): val is KindError<TName, string, TContext> {
            return isKindError(val) && val.kind === name
        },

        toString() {
            return `KindErrorType<${name}>`
        }
    }


    const fn = <
        TMsg extends string,
        TCtx extends Dictionary<string>
    >(
        msg: TMsg,
        ctx?: TCtx
    ) => {
        const mergedContext = {
            ...context,
            ...(ctx || {}),
        } as MergeObjects<TContext, TCtx>;

        const err = new Error(msg) as any;

        const stackTrace = getStackTrace();
        
        err.__kind = "KindError";
        err.kind = name;
        err.type = asKindType(name);
        err.subType = asKindSubType(name);
        err.name = toPascalCase(name);
        err.message = msg;
        err.stackTrace = () => stackTrace;
        err.stack = err.stack || "";
        err.context = mergedContext;
        
        err.toString = toStringFn(msg, mergedContext, stackTrace);

        return err;
    }

    return createFnWithProps(fn, props) as unknown as Rtn<TName,TContext>
}
