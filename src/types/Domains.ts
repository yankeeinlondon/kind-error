import { FromSchemaTuple, SchemaCallback } from "./schema-types";

export type EmailDomain = `${string}.${string}` | SchemaCallback;


export type Email<T extends readonly EmailDomain[] = []> = [] extends T
? `${string}@${string}.${string}`
: FromSchemaTuple<T> extends infer Constraint extends string[]
    ? `${string}@${Constraint[number]}`
    : never;
