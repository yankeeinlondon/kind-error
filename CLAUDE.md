# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`kind-error` is a TypeScript library that provides an enhanced error primitive for JavaScript/TypeScript with better type support, context management, and structured stack traces. It exports the `createKindError()` function which produces type-safe error constructors.

## Common Commands

### Testing
- `pnpm test` - Run tests in watch mode
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
   - Has static methods: `rebase()`, `proxy()`, `is()`
   - Stores metadata: `kind`, `type`, `subType`, `errorName`, `context`

2. **KindError**: The actual error instance with enhanced properties:
   - `kind`: kebab-case error identifier (e.g., "invalid-request")
   - `name`: PascalCase error name (e.g., "InvalidRequest")
   - `type` and `subType`: parsed from kind (supports "foo/bar" syntax)
   - `context`: typed key-value dictionary merging base and instance context
   - `stackTrace()`: function returning structured stack array
   - `file`, `line`, `col`, `fn`: direct access to top stack frame

3. **Error Kind Naming**: Supports hierarchical naming with `/` separator
   - Input: `"foo/bar"` → kind: `"foo/bar"`, type: `"foo"`, subType: `"bar"`
   - Awkward characters are stripped: `"FooBar<Baz>"` → `"foo-bar-baz"`

### Key Implementation Details

- **Function with Properties Pattern**: Uses `createFnWithPropsExplicit()` to create callable objects with static properties (src/utils/createFnWithProps.ts)
- **Error Proxying**: The `proxy()` method wraps non-KindErrors by adding them to context as `underlying` (src/static/proxy.ts)
- **Stack Trace Parsing**: Uses `error-stack-parser-es` to convert string stack traces into structured arrays (src/utils/error-proxies.ts)
- **Context Merging**: Base context from `createKindError()` is merged with instance context, with instance values taking precedence

### Project Structure

```
src/
├── kindError.ts          # Main createKindError() function
├── types.ts              # All TypeScript type definitions
├── instance/             # Instance methods (toString, toJSON, inspect, etc.)
├── static/               # Static methods (proxy, rebase, is)
├── type-guards/          # Type guards (isKindError, isError, isErrorResponse)
└── utils/                # Utilities (stack parsing, function helpers)
```

### Type Testing Approach

Tests combine runtime behavior tests with explicit type tests:
- Type tests use `@type-challenges/utils` (`Expect`, `Equal`, `Extends`)
- Variables named `cases` or prefixed with `_` are ignored by linter (for type-only tests)
- Type tests validate complex generic behavior of `KindErrorType` and `KindError`

### Dependencies

Peer dependencies (not bundled):
- `inferred-types`: Provides type utilities and runtime helpers
- `error-stack-parser-es`: Parses error stack traces
- `chalk`: Terminal colors (for formatting)
- `pathe`: Path utilities

### Build Configuration

- **tsdown**: Bundles to ESM and CJS with TypeScript declarations
- **Vitest**: Test runner with path alias `~` → `./src`
- **ESLint**: Uses @antfu/eslint-config with custom overrides for `cases` variable pattern
