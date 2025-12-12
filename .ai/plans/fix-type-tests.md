# Plan: Fix Failing Type Tests

## Summary

There are **10 failing type tests** across **3 test files**. All failures are TypeScript type assertion errors (`TS2344: Type 'false' does not satisfy the constraint 'true'`), indicating that type-level expectations are not matching actual types.

## Failing Files

1. **tests/core/createKindError.test.ts** - 7 type errors
2. **tests/utils/asRuntimeToken.test.ts** - 9 type errors
3. **tests/utils/isVariant.test.ts** - 13 type errors

---

## Phase 1: Fix `isVariant` Return Type (13 type errors)

### Problem
The `isVariant` function at `src/utils/isVariant.ts:12` has return type `boolean`:
```typescript
export function isVariant<const T>(val: T): boolean
```

But the tests expect the return type to be narrowed to literal `true` or `false` based on the input type:
```typescript
const t1 = isVariant("string");  // Expected: true, Actual: boolean
const f1 = isVariant("foo");     // Expected: false, Actual: boolean
```

### Solution
Update the return type to use the `IsVariant<T>` type utility:
```typescript
import type { IsVariant } from "~/types";

export function isVariant<const T>(val: T): IsVariant<T>
```

### Tests to fix
- Line 35-37: `AssertTrue<typeof t1/t2/t3>` for "string", "number", "boolean"
- Line 57-62: `AssertTrue<typeof t1-t6>` for array tokens
- Line 76-78: `AssertFalse<typeof f1/f2/f3>` for literal tokens
- Line 88: `AssertFalse<typeof f1>` for non-token literal "foo"

---

## Phase 2: Fix `asRuntimeToken` Return Type (9 type errors)

### Problem
The `asRuntimeToken` function's overload signature at `src/utils/asRuntimeToken.ts:29` doesn't properly handle all cases:
```typescript
export function asRuntimeToken<T>(token: T): T extends Scalar | RuntimeToken ? AsRuntimeToken<T> : never;
```

The tests show that calling with certain scalars returns `never` instead of the expected `RuntimeToken`:
```typescript
const str = asRuntimeToken("foo");  // Expected: RuntimeToken<"string::foo">, Actual: never or wrong type
```

### Root Cause Analysis
1. The `AsRuntimeToken<T>` type at `src/types/AsRuntimeToken.ts` has issues:
   - Line 28 constraint: `T extends Scalar | RuntimeToken | RuntimeTokenCallback` doesn't include the base type strings like `"string"`, `"number"`
   - The `FromScalar<T>` type doesn't handle `RuntimeBaseType` strings properly

2. When `T = "foo"` (a string literal):
   - `"foo"` extends `Scalar` ✓
   - But `AsRuntimeToken<"foo">` should return `RuntimeToken<"string::foo">`
   - The type is resolving incorrectly

### Solution
1. Update the function overloads in `src/utils/asRuntimeToken.ts`:
   - Add overload for `RuntimeBaseType` strings: `asRuntimeToken<T extends RuntimeBaseType>(token: T): RuntimeToken<T>`
   - Add overload for extended base type strings: `asRuntimeToken<T extends \`${RuntimeBaseType}::${string}\`>(token: T): RuntimeToken<T>`

2. OR fix the `AsRuntimeToken` type utility to properly handle:
   - Base type strings like `"string"`, `"number"` → `RuntimeToken<"string">`, `RuntimeToken<"number">`
   - Literal scalars like `"foo"`, `42` → `RuntimeToken<"string::foo">`, `RuntimeToken<"number::42">`
   - Boolean literals `true`, `false` → `RuntimeToken<"true">`, `RuntimeToken<"false">`

### Tests to fix
- Line 26: `asRuntimeToken("string")` → `RuntimeToken<"string">`
- Line 42-48: Scalar tokenization tests for "foo", 42, true, false, etc.
- Line 63: SchemaCallback to RuntimeToken assertion

---

## Phase 3: Fix `createKindError` Schema Type (7 type errors)

### Problem
The tests at `tests/core/createKindError.test.ts` have type assertions that fail:

1. **Line 124**: `AssertExtends<Kind["schema"], { test: true, foo: SchemaCallback }>`
   - The schema property type doesn't properly represent `SchemaCallback` values

2. **Line 156**: `AssertExtends<Kind["schema"], { test: true; foo: "string" }>`
   - The schema doesn't preserve the schema callback's resolved type

3. **Lines 180, 185**: `Property 'color' does not exist on type '...'`
   - The KindError instance doesn't include context properties in its type

### Root Cause Analysis
1. `KindErrorType<TName, TSchema>` at line 48 defines `schema: TSchema` - this should work
2. The issue may be in how `DetectOptionalValues<FromSchema<TSchema>>` transforms the schema type
3. The `FromSchema` type may be converting `SchemaCallback` values incorrectly

### Solution
1. Check `src/types/FromSchema.ts` to ensure it preserves `SchemaCallback` types when needed
2. Verify the `KindError` type includes context properties properly
3. May need to adjust the `Rtn` type in `createKindError.ts` to preserve the original schema

### Additional Analysis Needed
- Trace `DetectOptionalValues<FromSchema<TSchema>>` to understand the transformation
- Check if `KindError<TName, TMsg, TContext>` properly includes context properties

---

## Implementation Order

1. **Phase 1**: Fix `isVariant` return type - Simple fix, isolated to one file
2. **Phase 2**: Fix `asRuntimeToken` return type - May require changes to `AsRuntimeToken` type utility
3. **Phase 3**: Fix `createKindError` types - Most complex, requires understanding the type transformation chain

## Files to Modify

- `src/utils/isVariant.ts` - Update return type
- `src/utils/asRuntimeToken.ts` - Update overload signatures
- `src/types/AsRuntimeToken.ts` - Fix type utility logic
- `src/types/FromSchema.ts` - Potential fixes for schema transformation
- `src/types/KindError.ts` - Ensure context properties are included

## Success Criteria

- All 154 runtime tests continue to pass
- All 143 type tests pass
- `pnpm test` exits with code 0
