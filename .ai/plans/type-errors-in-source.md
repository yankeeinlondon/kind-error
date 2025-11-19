# Plan: Fix Type Errors in Source

This plan addresses the 43 type errors found in the source code.

## Analysis

The errors fall into several categories:
1.  **Type Mismatches in `KindError` Structure**: `stackTrace` is defined as an array in the type but implemented/used as a function.
2.  **Missing Properties**: `toStringFn` and `toJSONFn` access `fn`, `file`, `line` on the error object, which don't exist on `KindError` or the runtime object.
3.  **Generic Constraint Violations**: `KindError` usage in signatures often mismatches the definition or constraints.
4.  **Broken References**: `KindErrorType__Props` is missing.
5.  **Example Import Paths**: Examples use "src" which isn't resolvable.

## Steps

### 1. Fix `KindError` Type Definition
**File:** `src/types/KindError.ts`

*   **Goal**: Align type with implementation (lazy stack trace).
*   **Action**:
    *   Change `stackTrace: KindStackItem[];` to `stackTrace: () => KindStackItem[];`.
    *   Ensure `KindErrorShape` also reflects this if necessary.

### 2. Update `toStringFn` and `toJSONFn`
**Files:** `src/instance/toStringFn.ts`, `src/instance/toJSONFn.ts`

*   **Goal**: Remove reliance on non-existent properties (`fn`, `file`, `line`) and correct `stackTrace` usage.
*   **Action**:
    *   In `toStringFn.ts`:
        *   Ensure `err.stackTrace` is called as a function (it already is).
        *   Remove `err.fn`, `err.file`, `err.line` usage. Instead, derive these from `err.stackTrace()[0]` if available.
    *   In `toJSONFn.ts`:
        *   Call `err.stackTrace()` to get the stack.
        *   Use the first frame to populate `fn`, `line`, etc., or omit them if not present.

### 3. Fix `src/utils/error-proxies.ts`
**File:** `src/utils/error-proxies.ts`

*   **Goal**: Fix `createKindError` usage, `KindError` generic arguments, and `stackTrace` assignment.
*   **Action**:
    *   Update `error.stackTrace` assignment. Since `createStackTrace(err)` returns an array, wrap it in a function: `() => createStackTrace(err)`.
    *   Fix `as unknown as KindError<TKind, TCtx>` cast to `as unknown as KindError<TKind, string, TCtx>` (3 arguments).
    *   Ensure `ctx` passed to `createKindError` matches expectations.

### 4. Fix `src/static/proxy.ts`
**File:** `src/static/proxy.ts`

*   **Goal**: Resolve missing `KindErrorType__Props`.
*   **Action**:
    *   It seems `KindErrorType__Props` is not exported. Inspect `src/types/index.ts` or `KindErrorType.ts` to see if we can import `KindErrorType` and use `KindErrorType<...>["proxy"]`.
    *   Change `ReturnType<KindErrorType__Props<... >["proxy"]>` to `ReturnType<KindErrorType<TKind, TBase>["proxy"]>`.

### 5. Fix `KindErrorSignature.ts` and `KindErrorType.ts` Constraints
**Files:** `src/types/KindErrorSignature.ts`, `src/types/KindErrorType.ts`

*   **Goal**: Resolve `Type does not satisfy constraint` errors.
*   **Action**:
    *   The issue is likely that `ResolveContext` can theoretically return `never` or types not strictly extending `Record<string, unknown>` in TS's view, although it casts to `Record<string, unknown>`.
    *   Verify if `KindError`'s `TCtx` constraint (`extends Record<string, unknown>`) is too strict for the inferred output of `ResolveContext`.
    *   If `ResolveContext` returns `any` or `never` in some cases, it might break.
    *   Will try to relax `KindError` constraint or ensure `ResolveContext` output is strictly compatible.
    *   Check `src/createKindError.ts` where `Rtn` is defined.

### 6. Fix Examples
**Files:** `examples/console.ts`, `examples/instantiate.ts`

*   **Goal**: Fix module resolution.
*   **Action**:
    *   Change `import ... from "src"` to `import ... from "../src"`.

## Verification
*   Run `pnpm test:source` after each major step or at the end to ensure errors decrease.
