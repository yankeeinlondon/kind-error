import type { As, Contains, EmptyObject, Err, MergeObjects, Mutable } from "inferred-types";
import type { AsContextShape, DetectOptionalValues, FromSchema, KindError, KindErrorType, ResolveContext, SchemaDictionary } from "~/types";
import { inspect } from "node:util";
import {
    createFnWithProps,
    err,
    toPascalCase,
} from "inferred-types";
import {
    asKindSubType,
    asKindType,
    getStackTrace,
    removeVariants,
    renameFunction,
} from "~/utils";
import { toJsonFn, toStringFn } from "./instance";
import { proxyFn } from "./static";
import { isKindError } from "./type-guards";

type Rtn<
    TName extends string,
    TSchema extends SchemaDictionary,
> = Contains<TName, "<" | ">" | "[" | "]" | "(" | ")"> extends true
    ? Err<
        "invalid-name",
        `The name for a KindError must not include any of the following characters: "<", ">", "[", "]", "(", ")"`
    >
    : KindErrorType<TName, DetectOptionalValues<FromSchema<TSchema>>>;

/**
 * **createKindError**`(name, context)`
 *
 * Creates a `KindErrorType` which can then be called to create
 * the underlying `KindError` instance.
 */
export function createKindError<
    const TName extends string,
    const TSchema extends SchemaDictionary,
>(
    name: TName,
    schema: TSchema = {} as EmptyObject as TSchema,
): Rtn<TName, TSchema> {
    if (/[<>[\]()]/.test(name)) {
        return err("invalid-name", `The name for a KindError must not include any of the following characters: "<", ">", "[", "]", "(", ")"`) as Rtn<TName, TSchema>;
    }

    const partial = <const C extends SchemaDictionary>(ctx: C) => {
        return createKindError(
            name,
            { ...schema, ...ctx }
        ) as unknown as KindErrorType<
            TName,
            ResolveContext<TSchema,C>
        >;
    } ;

    const pascalName = toPascalCase(name.replace(/\//g, "-"));

    const fn = <
        TMsg extends string,
        TCtx extends Record<string, unknown>,
    >(
        msg: TMsg,
        ctx?: TCtx,
    ) => {
        const staticContext = removeVariants(schema);
        const mergedContext = {
            ...staticContext,
            ...(ctx || {}),
        } as MergeObjects<TSchema, TCtx>;

        const err = new Error(msg) as any;

        const stackTrace = getStackTrace();

        err.__kind = "KindError";
        err.kind = name;
        err.type = asKindType(name);
        err.subType = asKindSubType<TName>(name);
        err.name = pascalName;
        err.message = msg;
        err.stackTrace = () => stackTrace;
        err.stack = err.stack || "";
        Object.assign(err, mergedContext);

        err.toString = toStringFn(err);
        err.toJSON = toJsonFn(err);

        err[inspect.custom] = () => {
            return err.toString();
        };

        return err;
    };

    const props = {
        __kind: "KindErrorType",
        kind: name,
        errorName: pascalName,
        type: asKindType(name),
        subType: asKindSubType<TName>(name),
        schema,

        proxy: proxyFn(name, schema),

        partial,

        is(val: unknown): val is KindError<TName, string, TSchema> {
            return isKindError(val) && val.kind === name;
        },

        toString() {
            return `KindErrorType::${pascalName}(${name})`;
        },

        toJSON() {
            return {
                __kind: "KindErrorType",
                kind: name,
                name: `${pascalName}ErrorType`,
                errorName: pascalName,
                type: asKindType(name),
                subType: asKindSubType(name),
                schema,
            };
        },
    };

    const namedFn = renameFunction(fn, `${pascalName}ErrorType`);

    return createFnWithProps(namedFn, props) as unknown as Rtn<TName, TSchema>;
}
