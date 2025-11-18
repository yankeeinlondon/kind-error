import {
    As,
    Dictionary,
    ExpandRecursively,
    PascalCase,
} from 'inferred-types';
import { AsKindSubType, AsKindType, KindStackItem } from '~/types';

/**
 * The basic _shape_ of a `KindError`
 */
export type KindErrorShape = {
    __kind: "KindError";
    kind: string;
    type: string;
    subType: string | undefined;
    message: string;
    stack?: string;
    stackTrace: KindStackItem[];
} & Error;


/**
 * **KindError**`<[TName],[TMsg],[TCtx]>`
 *
 * A `KindError`, which extends the Javascript `Error` type and
 * provides literal types where possible to describe the error.
 */
export type KindError<
    TName extends string = string,
    TMsg extends string = string,
    TCtx extends Record<string, unknown> = Record<string, unknown>
> = (ExpandRecursively<{
    __kind: "KindError";
    name: PascalCase<AsKindType<TName>>;
    kind: TName;
    type: AsKindType<TName>;
    subType: AsKindSubType<TName>;
    message: TMsg;
    stack?: string;
    stackTrace: KindStackItem[];

    toString(): string;
} & TCtx> & Error) extends infer KErr
    ? KErr
    : never;

