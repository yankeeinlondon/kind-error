# Gemini Context: Kind Error

This `GEMINI.md` file provides essential context for interacting with the `@yankeeinlondon/kind-error` project.

## Project Overview

**Kind Error** is a TypeScript library designed to replace the standard JavaScript `Error` primitive with a more robust, strongly-typed, and structured alternative. It focuses on providing:

* **Strong Typing:** Errors are defined as types (`KindErrorType`) with specific schemas for their context properties.
* **Structured Data:** Errors include structured stack traces and strongly-typed context objects, enforcing strict checking at compile time.
* **Better DX:** Improved developer experience with clear error names, kinds, types, and subtypes.

**Key Technologies:**

* **Language:** TypeScript
* **Testing:** Vitest (Runtime), `typed-tester` (Type checking)
* **Build:** `tsdown`
* **Linting:** ESLint

## Architecture & structure

* **Entry Point:** `src/index.ts` exports the public API.
* **Core Logic:** `src/createKindError.ts` contains the factory function for creating error types.
* **Types:** `src/types/` contains the extensive type definitions that power the library's strong typing capabilities.
* **Utils:** `src/utils/` contains helper functions for stack trace parsing and type manipulation.

## Building and Running

The project uses `pnpm` for script execution.

* **Run Tests:**
  * `pnpm test`: Runs a custom test script (`scripts/test.mjs`).
  * `pnpm test:runtime`: Runs runtime unit tests using Vitest.
  * `pnpm test:types`: Runs type-level tests using `typed-tester`.
  * `pnpm test:ci`: Runs tests for CI environments.

* **Build Project:**
  * `pnpm build`: Builds the project using `tsdown` and generates declaration files (`--dts`).

* **Development:**
  * `pnpm watch`: Watches for changes and rebuilds.
  * `pnpm lint`: Lints the `src` directory using ESLint.

## Development Conventions

* **Path Aliases:** The project uses `~` as an alias for the `src` directory (configured in `tsconfig.json`).
* **Testing Strategy:**
  * Runtime behavior is tested with Vitest.
  * Type correctness is rigorously tested using `typed-tester` (files often named like `*.test.ts` but executed via `typed test`).
* **Type Safety:** The project relies heavily on complex TypeScript types (generics, conditional types, inferred types) to ensure type safety for error context and properties.

## Key Files

* `src/createKindError.ts`: The core factory function.
* `src/types/KindError.ts`: Definition of the `KindError` type.
* `src/types/KindErrorType.ts`: Definition of the `KindErrorType` (the factory/class-like structure).
* `README.md`: Comprehensive usage documentation.
