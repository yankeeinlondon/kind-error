# Plan: Schema Completion for KindError

This plan outlines the steps to complete the transition from `InputToken` based schemas to `SchemaCallback` based schemas in `@yankeeinlondon/kind-error`.

## Phase 1: Documentation Update

**Objective:** Update documentation to accurately reflect the new `SchemaCallback` mechanism and its integration with `createKindError`.

**Deliverables:**

1. Updated `@docs/schemas.md`.
2. This plan document.

**Tasks:**

1. **Review & Update `@docs/schemas.md`**:
    * Expand the "Kind Error Type Schemas" section.
    * Document `createKindError` usage with `SchemaCallback` in detail.
    * Explain the distinction between "Static Context" (literals in schema) and "Dynamic Context" (schema definitions requiring runtime values).
    * Clarify the role of `SchemaApi`, `SchemaCallback`, and `SchemaResult`.
    * Remove or update any stale references if necessary (though the provided doc content seemed mostly fresh, I will ensure it's comprehensive).

## Phase 2: Code Implementation

**Objective:** Fix type errors in `src/createKindError.ts` and ensure all tests pass, fully integrating `SchemaCallback`.

**Tasks:**

1. **Refactor Type Utilities (`src/types/type-utils.ts`, `src/types/variants.ts`):** [x]
    * Replace `InputToken` logic with `SchemaCallback` logic.
      * There are a few places where we may keep the `InputToken` approach which are:
        * the "key" for `Record<key,value>`
        * the "key" for `WeakMap<key,value>`
        * all other instances should rely on the more recent `SchemaCallback` approach
    * Update `IsNonVariant`, `IsVariant` to handle `SchemaCallback` (by inspecting `SchemaResult<T>`).
    * Update `Variants` and `NonVariants` to correctly filter `SchemaCallback` properties based on their resolved types (e.g., `t.string("foo")` is non-variant).
    * Update `ParseContext` to align with `FromSchema` (or replace it with `FromSchema` if identical).
    * Ensure `AsContextShape` correctly derives the required runtime context type from the schema.

2. **Update `KindErrorType` Definition (`src/types/KindErrorType.ts`):** [x]
    * Ensure `KindErrorType['context']` is typed as `TSchema` (the schema definition) rather than the resolved type, to match runtime behavior.
    * Or, if `context` is intended to be resolved, ensure runtime matches. (Decision: `context` on `KindErrorType` should likely be the schema definition).

3. **Update `createKindError` Implementation (`src/createKindError.ts`):** [x]
    * **Runtime Fix:** In the error factory function `fn`, ensure `err.context` does *not* include `SchemaCallback` functions. It should only include merged static values and provided dynamic values.
    * **Type Fix:** Update `KindErrorType` return type to correctly propagate `TSchema`.
    * **Recursion:** Ensure `partial()` correctly handles merging schemas.

4. **Update `KindErrorSignature` (`src/types/KindErrorSignature.ts`):** [x]
    * Ensure it uses the updated `AsContextShape` to generate the correct function signature.

5. **Verify & Test:** [x]
    * Run `pnpm test` to ensure all tests pass.
    * Specifically check `tests/core/createKindError.test.ts` and schema-related tests.
    * Add new test cases if necessary to cover mixed static/dynamic context and `partial()` application.

## Execution

Phase 2 completed.

**Summary of Changes:**
- Updated `IsNonVariant`, `Variants`, `NonVariants` in `src/types/variants.ts` to support `SchemaCallback` and `SchemaResult`.
- Updated `ParseContext` in `src/types/type-utils.ts` to resolve `SchemaCallback` correctly.
- Updated `KindErrorType` to preserve `TContext` (schema definition) in `context` property.
- Implemented `removeVariants` in `src/utils/removeVariants.ts` to clean up static context.
- Updated `createKindError` to use `removeVariants` so that `err.context` only contains static literals and user-provided values.
- Updated `createKindError` and `asKindError` to ensure context properties are copied to the **root** of the error object, satisfying `KindError` type expectations and tests.
- Updated `proxyFn` in `src/static/proxy.ts` to properly merge user context, ensuring partial props work as expected.
- Restored `KindError` type definition to include `& TCtx` (root properties) AND `context: TCtx`.
- Fixed type tests in `createKindError.test.ts`, `asKindError.test.ts`, and `using-KindErrorType.test.ts`.
- Confirmed `pnpm test:types` and `pnpm test:runtime` pass cleanly.

Phase 2 is fully complete and verified.
