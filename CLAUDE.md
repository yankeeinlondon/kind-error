# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`kind-error` is a TypeScript library that provides an enhanced error primitive for JavaScript/TypeScript with better type support, context management, and structured stack traces. It exports the `createKindError()` function which produces type-safe error constructors.

## Common Commands

### Testing
- `pnpm test` - Run both runtime and type tests (locally runs both sequentially; CI only runs runtime)
- `pnpm test:runtime` - Run runtime tests with Vitest
- `pnpm test:types` - Run type tests with typed-tester
- `pnpm test:watch` - Run Vitest in watch mode
- `pnpm test:ci` - Run tests once (for CI)

### Building
- `pnpm build` - Build the library using tsdown (outputs to `dist/`)
- `pnpm watch` - Build in watch mode

### Linting
- `pnpm lint` - Run ESLint with auto-fix

### Release
- `pnpm release` - Bump version using bumpp

## Architecture

### Core Concepts

1. **KindErrorType**: A callable function with properties that serves as an error constructor. Created via `createKindError(kind, baseContext)`.
   - When called, produces a `KindError` instance
   - Has static methods: `proxy()`, `partial()`, `is()`
   - Stores metadata: `kind`, `type`, `subType`, `errorName`, `context`
   - The calling signature varies based on required/optional context properties

2. **KindError**: The actual error instance with enhanced properties:
   - `kind`: kebab-case error identifier (e.g., "invalid-request")
   - `name`: PascalCase error name (e.g., "InvalidRequest")
   - `type` and `subType`: parsed from kind (supports "foo/bar" syntax)
   - `context`: typed key-value dictionary merging base and instance context
   - `stackTrace`: property containing structured stack array
   - `toString()`: method for string representation

3. **Error Kind Naming**: Supports hierarchical naming with `/` separator
   - Input: `"foo/bar"` → kind: `"foo/bar"`, type: `"foo"`, subType: `"bar"`
   - Invalid characters `< > [ ] ( )` are rejected at creation time
   - Names are converted to kebab-case for `kind` and PascalCase for `name`

### Key Implementation Details

- **Function with Properties Pattern**: Uses `createFnWithProps()` from `inferred-types` to create callable objects with static properties
- **Error Proxying**: The `proxy()` method handles various error types:
  - If already a `KindError`, passes through unchanged
  - Native `Error` objects: extracts message and stack, adds as `underlying`
  - Fetch errors (Response objects): special handling via `isFetchError()`
  - Plain objects: extracts properties and adds as `underlying`
  - Other types: stringified and wrapped
- **Stack Trace Management**: Uses `error-stack-parser-es` to convert string stack traces into structured `KindStackItem[]` arrays
- **Context Merging**: Base context from `createKindError()` is merged with instance context, with instance values taking precedence
- **Dynamic Signatures**: `KindErrorSignature` type determines function signature based on whether context has required variant properties

### Project Structure

```
src/
├── createKindError.ts    # Main createKindError() function implementation
├── index.ts              # Public API exports
├── instance/             # Instance methods (toString, toJSON, inspect, asBrowserMessage)
├── static/               # Static methods (proxy, rebase, is)
├── type-guards/          # Type guards (isKindError, isError, isFetchError, etc.)
├── types/                # All TypeScript type definitions
│   ├── KindError.ts      # KindError instance type
│   ├── KindErrorType.ts  # KindErrorType constructor type
│   ├── type-utils.ts     # Type utilities for parsing context/names
│   └── base-types.ts     # Shared base types
└── utils/                # Runtime utilities (stack parsing, type conversions)
```

### Type Testing Approach

Tests combine runtime behavior tests with explicit type tests:
- **Runtime tests**: Use Vitest with standard `describe()` and `it()` blocks
- **Type tests**: Use `typed-tester` package (run via `pnpm test:types`)
  - Also use `@type-challenges/utils` (`Expect`, `Equal`, `Extends`) for inline type assertions
  - Variables named `cases` or prefixed with `_` are ignored by linter (dedicated to type-only tests)
  - Type tests validate complex generic behavior, especially `KindErrorSignature` and context merging
- The `pnpm test` command runs both test suites sequentially (runtime first, then types)
- In CI environments, only runtime tests are executed

### Dependencies

**Peer dependencies** (not bundled):
- `inferred-types`: Provides type utilities (like `As`, `Dictionary`, `MergeObjects`) and runtime helpers (like `createFnWithProps`, `toPascalCase`)
- `error-stack-parser-es`: Parses error stack traces into structured arrays
- `chalk`: Terminal colors for formatting error output
- `pathe`: Path utilities for stack trace parsing

### Build Configuration

- **tsdown**: Bundles to ESM (`.js`) and CJS (`.cjs`) with TypeScript declarations (`.d.ts`)
  - Entry: `src/index.ts`
  - Output: `dist/`
  - Includes sourcemaps and tree-shaking
- **Vitest**: Test runner with path alias `~` → `./src`
- **ESLint**: Uses `@antfu/eslint-config` with custom overrides:
  - Variables named `cases` or prefixed with `_` are ignored (for type-only tests)
  - Double quotes, semicolons required (stylistic choices)
