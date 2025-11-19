# Type Optimization Strategy

This document outlines the strategies and patterns used to optimize TypeScript performance and correctness in the `kind-error` library. The library relies heavily on complex generic types, conditional types, and recursive inference, which can lead to "Type instantiation is excessively deep" errors (TS2589) and performance bottlenecks if not managed carefully.

## 1. Preserving Literal Types (Preventing Widening)

**Problem:**
When passing object literals as context, TypeScript often widens literal types (e.g., `"bob"`) to their primitives (`string`). This breaks strict type checks that rely on specific string literals.

**Solution:**
Use `const` type parameters in generic signatures. This hints to the compiler that the argument should be inferred as a constant literal type.

**Example (`src/types/KindErrorSignature.ts`):**

```typescript
// Before
export type KindErrorSignature<TSchema> = <TCtx>(msg: string, ctx: TCtx) => ...

// After
export type KindErrorSignature<TSchema> = <const TCtx>(msg: string, ctx: TCtx) => ...
```

## 2. Reducing Instantiation Depth

**Problem:**
Recursive types and deeply nested conditional types can quickly hit TypeScript's recursion limit (approx. 50 levels). This is common when merging objects or processing deeply nested schemas.

### Strategy A: Using `infer` to Cache Computations

Instead of recalculating a complex type multiple times within a conditional branch, use `extends infer X` to calculate it once and reuse it.

**Example (`src/types/ResolveContext.ts`):**

```typescript
// Before (AsContextShape calculated multiple times)
type ResolveContext<TSchema, TCtx> = 
  IsEqual<AsContextShape<TSchema>, EmptyObject> extends true 
    ? ... 
    : Fallback<TCtx, EmptyObject> extends AsContextShape<TSchema> 
      ? ...;

// After (Calculated once)
type ResolveContext<TSchema, TCtx> = 
  AsContextShape<TSchema> extends infer ContextShape
    ? IsEqual<ContextShape, EmptyObject> extends true
      ? ...
      : Fallback<TCtx, EmptyObject> extends ContextShape 
        ? ...
    : never;
```

### Strategy B: Avoid Unnecessary Recursive Expansion

Utilities like `ExpandRecursively` or `ExpandDictionary` are great for tooltips but very expensive for the compiler. If a type is just an intersection (`A & B`) and acts correctly, avoid forcing an expansion unless necessary for inspection.

**Example (`src/types/KindError.ts`):**

```typescript
// Before: Forces deep recursion on every error instantiation
export type KindError<...> = ExpandRecursively<{ ... } & TCtx> & Error;

// After: Simpler intersection, faster inference
export type KindError<...> = ({ ...; context: TCtx } & Error);
```

## 3. Aligning Static Types with Runtime Behavior

**Problem:**
Mismatch between the runtime structure of an object and its TypeScript definition causes confusion and forces developers (and tests) to rely on incorrect assertions.

**Example:**
Runtime `createKindError` puts context properties into a `.context` object, but the type definition tried to merge them onto the root error object.

**Solution:**
Update the type definition to reflect reality. This often simplifies the type, as flattening an object type (`A & B`) is sometimes more complex to resolve than nesting it (`{ context: B }`).

```typescript
// src/types/KindError.ts
export type KindError<..., TCtx> = {
  // ...
  context: TCtx; // Explicit property
} & Error;
```

## 4. Optimizing Type Tests

**Problem:**
Testing complex recursive types using strict equality checks (like `AssertEqual` or `Equal`) is extremely expensive. It forces the compiler to fully resolve and compare every single nested property, often triggering TS2589 "excessively deep" errors in test files even when the library code is fine.

**Solution:**
Refactor tests to check specific properties or use `AssertExtends` for assignability checks, rather than demanding perfect structural identity of massive recursive types.

**Example (`tests/core/createKindError.test.ts`):**

```typescript
// Before: Expensive deep comparison
Expect<AssertEqual<
    typeof MyError,
    KindErrorType<"my-error", { test: true }>
>>

// After: Targeted, fast property checks
Expect<AssertEqual<typeof MyError["kind"], "my-error">>,
Expect<AssertEqual<typeof MyError["context"], { test: true }>>,
```

## Summary of Best Practices

1.  **Prefer `const T`** generics for inferring literals.
2.  **Cache intermediate types** with `infer` in complex conditionals.
3.  **Avoid recursive mapped types** (like `ExpandRecursively`) in critical paths unless strictly necessary for API surface readability.
4.  **Align types with runtime** to avoid "fighting" the compiler.
5.  **Write targeted type tests** that verify behavior without triggering recursion limits.
