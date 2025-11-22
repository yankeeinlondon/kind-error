import type { HasRequiredVariants, Variants } from "./variants";

export type KindErrorTypeContext<
  TSchema extends Record<string, unknown>,
> = HasRequiredVariants<TSchema> extends true
  ? Variants<TSchema>
  : Variants<TSchema> | undefined;
