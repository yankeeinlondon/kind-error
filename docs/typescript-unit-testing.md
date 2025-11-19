# TypeScript Unit Testing

## Overview

TypeScript testing has a **dual nature** that sets it apart from most other languages: you need to test both **runtime behavior** and **type correctness**.

This guide covers the TypeScript-specific mechanics of testing. For general TDD workflow, test organization, and best practices, see the [main Testing Skill guide](./SKILL.md).

### Why TypeScript Needs Special Consideration

- **Type utilities**: Functions that operate at the type level have no runtime behavior
- **Narrow types**: Functions may return literal types that need validation
- **Type safety**: TypeScript's type system provides compile-time guarantees worth testing
- **Dual validation**: Many functions need both runtime tests (behavior) and type tests (correctness)

---

## 🛑 STOP: Before Writing ANY Tests

**If you're about to write tests for TypeScript code, STOP and answer these questions first:**

### Question 1: What kind of symbol are you testing?

- **Type utility** (e.g., `type MyUtil<T> = ...`) → **TYPE TESTS ONLY** (no runtime behavior)
- **Function with generics** (e.g., `function foo<T>(...): T`) → **BOTH runtime AND type tests**
- **Function with narrow return type** (e.g., returns `"foo"` not `string`) → **BOTH runtime AND type tests**
- **Simple function** (no generics, returns wide types) → **RUNTIME tests minimum**
- **Class** → Start with **RUNTIME tests**, add type tests if generics involved

### Question 2: Does this function use complex types?

Ask yourself:

- ✅ Does it use generic parameters? (e.g., `<T extends ...>`)
- ✅ Does it return narrow/literal types? (e.g., `"success"` instead of `string`)
- ✅ Does it have type narrowing in parameters? (e.g., `HookPayload<T>`)

**If YES to ANY:** You MUST include type tests alongside runtime tests.

### Question 3: Do I know the correct TypeScript testing pattern?

**The ONLY correct pattern for functions:**

```typescript
it('should do something', async () => {
  // 1. Execute and CAPTURE result
  const result = await myFunction('input');

  // 2. Test RUNTIME value
  expect(result).toBe('expected');

  // 3. Test TYPE of captured value
  type cases = [
    Expect<AssertEqual<typeof result, string>>
  ];
});
```

**Key requirements:**

- ✅ Result CAPTURED in a variable (not just called)
- ✅ RUNTIME value tested with `expect()`
- ✅ TYPE of that variable tested with type assertions
- ✅ BOTH tests in the SAME `it()` block

**If you cannot answer "yes" to all three questions above, read the sections below before proceeding.**

---

## Quick Reference: The Correct Pattern

Copy this template for functions with generics or narrow types:

```typescript
import { describe, it, expect } from 'vitest';
import type { Expect, AssertEqual } from 'inferred-types/types';
import { myFunction } from '~/my-module';

describe('myFunction', () => {
  it('should handle input correctly', async () => {
    // Execute and capture
    const result = await myFunction('test-input');

    // Runtime test
    expect(result).toBe('expected-output');

    // Type test
    type cases = [
      Expect<AssertEqual<typeof result, string>>
    ];
  });
});
```

**Remember:**

- Import from `inferred-types/types` (with `/types`)
- Use `AssertEqual`, `AssertExtends` (NOT `Equal`, `Equals`)
- Capture result, test value, test type
- No dummy assertions like `expect(true).toBe(true)`

---

## Tooling

### Test Runners

We use **Vitest** as the test runner for all tests (both runtime and type tests):

- Fast and modern test runner
- Compatible with Vite projects
- Excellent TypeScript support
- Uses `describe` and `it` blocks like Jest
- For more info: [Vitest Deep Dive](./vitest.md)

### Type Testing

For validating types, we use the **type-tester** CLI:

- Validates type correctness at design time
- Uses the `typed test [GLOB]` command
- Works alongside Vitest runtime tests
- Provides type assertion utilities via `inferred-types`

### Configuring Test Scripts

We recommend the following scripts in your `package.json`:

```json
{
  "scripts": {
    "test:runtime": "vitest run",
    "test:types": "node_modules/.bin/typed test",
    "test": "scripts/test.sh"
  }
}
```

This setup allows:

- **Isolated testing**: Run runtime or type tests separately
- **Combined testing**: Run both with a single `test` command
- **Consistent filtering**: Both runners support GLOB patterns

### Test Runner Script

Since both Vitest and type-tester use GLOB patterns for filtering, we need a script to forward arguments to both runners. Create `scripts/test.sh`:

```bash
#!/bin/bash

# Forward arguments to both test commands sequentially with section headers
echo -e "\033[1mRuntime Tests\033[0m"
echo ""
pnpm test:runtime "$@" && echo -e "\n\033[1mType Tests\033[0m" && echo "" && pnpm test:types "$@"
```

This allows commands like:

- `pnpm test` - runs all tests (runtime + type)
- `pnpm test WIP` - runs only WIP tests (both kinds)
- `pnpm test utils` - runs all utils tests (both kinds)

---

## The Dual Nature of TypeScript Testing

### 1. Runtime Tests

Runtime tests verify the **actual behavior** of code during execution.

**When to use:**

- Testing function outputs with various inputs
- Verifying error handling and edge cases
- Checking side effects (file I/O, API calls, state mutations)
- Validating business logic and algorithms
- Testing class instance behavior and methods

**Tools:**

- Test runner: Vitest
- Commands:
  - `pnpm test:runtime` - runs all runtime tests
  - `pnpm test:runtime GLOB` - runs tests matching the glob pattern

**Example:**

```typescript
import { describe, it, expect } from "vitest";
import { prettyPath } from "~/utils";

describe("prettyPath()", () => {
    it("should format a path with directory and filename", () => {
        const result = prettyPath("/path/to/file.ts");
        expect(result).toBe("/path/to/file.ts");
    });

    it("should handle edge case: empty string", () => {
        const result = prettyPath("");
        expect(result).toBe("");
    });

    it("should handle edge case: root path", () => {
        const result = prettyPath("/");
        expect(result).toBe("/");
    });
});
```

---

### 2. Type Tests

Type tests verify the **type correctness** of TypeScript code at _design_ time.

**When to use:**

- Testing type utility functions (ALWAYS)
- Verifying generic type constraints work as expected
- Ensuring conditional types resolve correctly
- Testing that complex inferred types are accurate
- Validating discriminated unions and type narrowing
- Checking that function signatures accept/reject correct types

**Tools:**

- CLI: `typed test`
- Assertions: `inferred-types` library
- Commands:
  - `pnpm test:types` - runs all type tests
  - `pnpm test:types GLOB` - runs type tests matching the glob pattern

---

## Type Test Mechanics

Type tests follow a specific structure that may seem unusual at first but becomes natural with practice.

### The `cases` Array

All type tests in a given `it` block are defined in an array called `cases`:

```typescript
type cases = [
    // ... type tests go here
]
```

**Note:** Linting rules allow `cases` to be defined without being used. This is intentional and correct.

### The `Expect<...>` Wrapper

Every type test is wrapped by an `Expect` type utility:

```typescript
type cases = [
    Expect<...>,
    Expect<...>,
    // ...
]
```

### Available Type Assertions

The `inferred-types` library provides assertion utilities:

#### `AssertTrue<T>`

Tests whether the **tested type** `T` is the type `true`:

```typescript
type cases = [
    Expect<AssertTrue<true>>,  // ✅ passes
    Expect<AssertTrue<false>>, // ❌ fails
]
```

#### `AssertFalse<T>`

Tests whether the **tested type** `T` is the type `false`:

```typescript
type cases = [
    Expect<AssertFalse<false>>,  // ✅ passes
    Expect<AssertFalse<true>>,   // ❌ fails
]
```

#### `AssertEqual<T, E>`

Tests that the **tested type** `T` _equals_ the **expected type** `E`:

```typescript
type cases = [
    Expect<AssertEqual<string, string>>,     // ✅ passes
    Expect<AssertEqual<"foo", "foo">>,       // ✅ passes
    Expect<AssertEqual<string, number>>,     // ❌ fails
    Expect<AssertEqual<"foo", string>>,      // ❌ fails (not equal, but extends)
]
```

#### `AssertExtends<T, E>`

Tests that the **tested type** `T` _extends_ the **expected type** `E`:

```typescript
type cases = [
    Expect<AssertExtends<"foo", string>>,    // ✅ passes
    Expect<AssertExtends<123, number>>,      // ✅ passes
    Expect<AssertExtends<string, number>>,   // ❌ fails
]
```

#### `AssertSameValues<T, E>`

Tests that the **tested type** `T` is an array type and every element of `E` and `T` are the same, but order doesn't matter:

```typescript
type cases = [
    Expect<AssertSameValues<[1, 2, 3], [3, 2, 1]>>,  // ✅ passes
    Expect<AssertSameValues<[1, 2], [1, 2, 3]>>,     // ❌ fails
]
```

#### `AssertContains<T, E>`

When the **tested type** `T` is a string:

- Passes when `E` is also a string representing a sub-string of `T`

When the **tested type** `T` is an array:

- Passes when all elements of `E` are present in `T`

```typescript
type cases = [
    Expect<AssertContains<"hello world", "world">>,  // ✅ passes
    Expect<AssertContains<[1, 2, 3], [2, 3]>>,       // ✅ passes
]
```

---

## Type Test Examples

### Example 1: Testing a Type Utility

Testing TypeScript's built-in `Capitalize<T>` utility:

```typescript
import { describe, it } from "vitest";
import type { Expect, AssertEqual } from "inferred-types/types";

describe("Capitalize<T>", () => {
    it("string literals", () => {
        type Lowercase = Capitalize<"foo">;
        type AlreadyCapitalized = Capitalize<"Foo">;

        type cases = [
            Expect<AssertEqual<Lowercase, "Foo">>,
            Expect<AssertEqual<AlreadyCapitalized, "Foo">>,
        ]
    });

    it("wide string", () => {
        type Wide = Capitalize<string>;

        type cases = [
            Expect<AssertEqual<Wide, string>>
        ]
    });

    it("only first letter capitalized", () => {
        type SpaceThenLetter = Capitalize<" foo">;
        type TabThenLetter = Capitalize<"\tfoo">;

        type cases = [
            Expect<AssertEqual<SpaceThenLetter, " foo">>,
            Expect<AssertEqual<TabThenLetter, "\tfoo">>,
        ]
    });
});
```

**Key points:**

- Type utilities have NO runtime behavior, so ONLY type tests are possible
- We still use `describe` and `it` for organization
- Intermediate types (`Lowercase`, `AlreadyCapitalized`) allow hovering to inspect types

### Example 2: Testing a Function with Narrow Return Type

Testing a function that returns a literal type:

```typescript
import { describe, it, expect } from "vitest";
import type { Expect, AssertEqual } from "inferred-types/types";
import { capitalize } from "~/utils";

// Function signature: capitalize<T extends string>(text: T): Capitalize<T>

describe("capitalize()", () => {
    it("leading alpha character", () => {
        const lowercase = capitalize("foo");
        const alreadyCapitalized = capitalize("Foo");

        // Runtime tests
        expect(lowercase).toEqual("Foo");
        expect(alreadyCapitalized).toEqual("Foo");

        // Type tests
        type cases = [
            Expect<AssertEqual<typeof lowercase, "Foo">>,
            Expect<AssertEqual<typeof alreadyCapitalized, "Foo">>,
        ]
    });

    it("wide string", () => {
        const wide = capitalize("foo" as string);

        // Runtime test
        expect(wide).toBe("Foo");

        // Type test
        type cases = [
            Expect<AssertEqual<typeof wide, string>>
        ]
    });

    it("non-alpha leading character", () => {
        const spaceThenLetter = capitalize(" foo");
        const tabThenLetter = capitalize("\tfoo");

        // Runtime tests
        expect(spaceThenLetter).toBe(" foo");
        expect(tabThenLetter).toBe("\tfoo");

        // Type tests
        type cases = [
            Expect<AssertEqual<typeof spaceThenLetter, " foo">>,
            Expect<AssertEqual<typeof tabThenLetter, "\tfoo">>,
        ]
    });
});
```

**Key points:**

- Runtime and type tests naturally fit in the same `describe`/`it` blocks
- NEVER separate runtime and type tests into different structures
- Intermediate constants allow hovering to inspect inferred types
- This pattern is common for library functions with narrow return types

---

## TypeScript Decision Framework

Use this to determine what types of tests to write:

```text
Is the symbol exported from the module?
│
├─ NO → Consider if it needs tests at all
│
└─ YES → What kind of symbol is it?
          │
          ├─ Type Utility (type that accepts generics)
          │  └─ Write TYPE TESTS only
          │     (no runtime behavior to test)
          │
          ├─ Constant (literal value)
          │  └─ Usually NO tests needed
          │     (unless it's a complex computed value)
          │
          ├─ Function / Arrow Function
          │  └─ Does it return a narrow/literal type?
          │     ├─ YES → Write BOTH runtime AND type tests
          │     └─ NO → Write RUNTIME tests (minimum)
          │              Consider type tests for complex generics
          │
          ├─ Class
          │  └─ Does it use generics or have methods with literal return types?
          │     ├─ YES → Write BOTH runtime AND type tests
          │     └─ NO → Write RUNTIME tests primarily
          │
          └─ Interface / Type Definition (type without generic input)
             └─ Usually NO test needed
                Exception: Complex types using many utilities might test
                that the result is not `any` or `never`
```

---

## Common TypeScript Testing Mistakes

### Mistake #1: Separated "Type Tests" Blocks (MOST COMMON)

**❌ WRONG - Separated structure:**

```typescript
describe("myFunction()", () => {
    describe("Runtime tests", () => {
        it("should work", () => {
            expect(myFunction("test")).toBe("result");
        });
    });

    describe("Type Tests", () => {  // ❌ WRONG!
        it("should have correct type", () => {
            const result = myFunction("test");
            const _check: typeof result extends string ? true : false = true;
            expect(_check).toBe(true);  // ❌ This is NOT a type test!
        });
    });
});
```

**✅ CORRECT - Integrated structure:**

```typescript
describe("myFunction()", () => {
    it("should work with string input", () => {
        const result = myFunction("test");

        // Runtime test
        expect(result).toBe("result");

        // Type test - in the SAME it() block
        type cases = [
            Expect<AssertEqual<typeof result, "result">>
        ];
    });
});
```

---

### Mistake #2: Using Runtime Checks for Type Testing

**❌ WRONG:**

```typescript
const result = myFunction("test");
const _isString: typeof result extends string ? true : false = true;
expect(_isString).toBe(true);  // This is runtime testing, not type testing!
```

**✅ CORRECT:**

```typescript
const result = myFunction("test");

// Runtime test (if needed)
expect(result).toBe("expected-value");

// Type test
type cases = [
    Expect<AssertExtends<typeof result, string>>
];
```

---

### Mistake #3: No `cases` Array

**❌ WRONG:**

```typescript
Expect<AssertEqual<typeof result, "expected">>;  // Not in cases array!
```

**✅ CORRECT:**

```typescript
type cases = [
    Expect<AssertEqual<typeof result, "expected">>
];
```

---

### Mistake #4: Using `typeof` with Runtime Assertions

**❌ WRONG:**

```typescript
const result = myFunction("test");
expect(typeof result).toBe("string");  // This is runtime, not type testing!
```

**✅ CORRECT:**

```typescript
const result = myFunction("test");

// Runtime test (if needed)
expect(result).toBe("expected-value");

// Type test
type cases = [
    Expect<AssertExtends<typeof result, string>>
];
```


### MISTAKE #5: THE CARDINAL SIN - Never Change Tests to Match Buggy Code

**⚠️ CRITICAL RULE: TESTS DOCUMENT CORRECT BEHAVIOR, NOT CURRENT BEHAVIOR**

This is the most important testing principle and MUST be followed at all times:

**NEVER change test expectations to make failing tests pass.**

When tests fail, there are ONLY THREE valid responses:

1. **Fix the implementation** - The implementation has a bug. Fix it.
2. **Validate with the user** - Ask the user if your test expectation is wrong. They must explicitly approve any changes to test assertions. Say: "I expected X to be true, but it's returning false. Should the test expect false instead, or is this a bug?"
3. **Mark as TODO (with user permission)** - If there's a known dependency that must be implemented first, ask the user for permission to use `it.todo()` or `describe.todo()`. Explain what needs to be done first and when this test can be enabled.

**INVALID responses:**

- ❌ Change `AssertTrue` to `AssertFalse` because the test is failing
- ❌ Change expected values to match buggy output
- ❌ Comment out failing tests "temporarily"
- ❌ Add comments like "known limitation" to justify wrong assertions
- ❌ Use `it.skip()` or `it.todo()` without user permission
- ❌ Assume your test expectation is wrong without asking

#### Example of the WRONG Approach

```typescript
// User says: "Arrays SHOULD match but there's a bug in Contains"
type ArrayUnion = string[] | number[] | [1, 2, 3];
type Test1 = UnionIncludes<ArrayUnion, [1, 2, 3]>;

// ❌ WRONG: Changing test to make it pass
type cases = [
    Expect<AssertFalse<Test1>>  // Changed to False to make test pass!
];
```

#### Example of the CORRECT Approach

```typescript
// User says: "Arrays SHOULD match but there's a bug in Contains"
type ArrayUnion = string[] | number[] | [1, 2, 3];
type Test1 = UnionIncludes<ArrayUnion, [1, 2, 3]>;

// ✅ CORRECT: Test asserts what SHOULD happen, even if it currently fails
type cases = [
    Expect<AssertTrue<Test1>>  // This SHOULD be true, so assert true
];
// This test will FAIL. That's GOOD. It documents the bug that needs fixing.
```

#### Why This Matters

1. **Tests are documentation** - They tell future developers what the code SHOULD do
2. **Failing tests are bug reports** - They point out what needs to be fixed
3. **Passing tests mean nothing if they're wrong** - Green tests that assert buggy behavior are worse than no tests
4. **You defeat the purpose of testing** - Tests exist to catch bugs, not hide them

#### When to Change Test Assertions

ONLY change test assertions when:

1. **User explicitly approves** - You asked the user "Should this be X or Y?" and they said "Y"
2. **Requirements changed** - The spec now says something different (with user confirmation)
3. **Test was factually wrong** - You misunderstood the API, made a typo, etc. (validate with user first)

NEVER change test assertions when:

1. **Implementation is buggy** - Fix the code, not the test
2. **To make CI pass** - This is hiding problems
3. **Because the test is failing** - That's the test doing its job!
4. **Linter/formatter changed it back** - The linter was CORRECTING your mistake
5. **Without user permission** - ALWAYS ask before changing assertions

#### When to Use `it.todo()` or `describe.todo()`

These modifiers mark tests that are written but cannot pass yet due to missing dependencies.

**✅ Valid use (with user permission):**

```typescript
// User approved: "Mark this as TODO until we fix the Contains bug"
it.todo("should match array types in unions", () => {
    type ArrayUnion = string[] | number[] | [1, 2, 3];
    type Test1 = UnionIncludes<ArrayUnion, [1, 2, 3]>;

    type cases = [
        Expect<AssertTrue<Test1>>  // Correct expectation, blocked by Contains bug
    ];
});
```

**❌ Invalid use (without permission):**

```typescript
// NO user permission - just trying to make tests pass
it.todo("should match array types in unions", () => {
    // ... hiding a failing test
});
```

**Process for using TODO:**

1. Write the test with correct expectations
2. Confirm it fails
3. Ask user: "This test documents correct behavior but fails due to [dependency]. May I mark it as `it.todo()` until [dependency] is fixed?"
4. Only use TODO if user approves
5. Document in test comment what needs to be done first

#### Red Flags That You're Making This Mistake

- You find yourself changing `true` to `false` or vice versa in assertions
- You're adding comments like "known limitation", "currently broken", "will fix later"
- The linter keeps changing your tests back
- You're adjusting expected values to match what the code actually does (rather than what it should do)
- You're thinking "I'll just make this pass for now"

**IF YOU FIND YOURSELF DOING ANY OF THESE: STOP IMMEDIATELY.**

The correct action is:

1. Keep the test asserting the correct behavior
2. Let it fail
3. Either fix the implementation or report that you cannot fix it yet and the test will fail until the bug is fixed


---

## Type Test Validation

Before submitting ANY work with type tests, verify:

1. **Pattern check**: Does every type test use `type cases = [...]`?
2. **Assertion check**: Does every assertion use `Expect<Assert...>`?
3. **Structure check**: Are type tests side-by-side with runtime tests?
4. **Import check**: Do files import from `inferred-types/types`?
5. **No separation**: Are there ZERO "Type Tests" describe blocks?
6. **Cardinal sin check**: Did you change ANY test assertions to make failing tests pass? If YES, STOP and revert.
7. **Tests document correct behavior**: Do assertions reflect what SHOULD happen, not what currently happens?

**If any check fails, the type tests are incorrect and must be rewritten.**

Note: Tests may fail if there are bugs in the implementation. That's expected and correct. DO NOT change assertions to make them pass.


---

## TypeScript-Specific Patterns

### Testing Type Narrowing

```typescript
describe("type narrowing", () => {
    it("should narrow type based on discriminant", () => {
        type Result =
            | { success: true; data: string }
            | { success: false; error: string };

        const handleResult = (result: Result) => {
            if (result.success) {
                type cases = [
                    Expect<AssertEqual<typeof result, { success: true; data: string }>>
                ];
                return result.data;
            } else {
                type cases = [
                    Expect<AssertEqual<typeof result, { success: false; error: string }>>
                ];
                return result.error;
            }
        };

        // Runtime tests
        expect(handleResult({ success: true, data: "ok" })).toBe("ok");
        expect(handleResult({ success: false, error: "fail" })).toBe("fail");
    });
});
```

### Testing Discriminated Unions

```typescript
describe("discriminated unions", () => {
    it("should handle all union cases", () => {
        type Animal =
            | { kind: "dog"; bark: () => void }
            | { kind: "cat"; meow: () => void };

        const makeSound = (animal: Animal) => {
            switch (animal.kind) {
                case "dog":
                    type DogCase = Expect<
                        AssertEqual<typeof animal, { kind: "dog"; bark: () => void }>
                    >;
                    return "woof";
                case "cat":
                    type CatCase = Expect<
                        AssertEqual<typeof animal, { kind: "cat"; meow: () => void }>
                    >;
                    return "meow";
            }
        };

        // Runtime tests
        expect(makeSound({ kind: "dog", bark: () => {} })).toBe("woof");
        expect(makeSound({ kind: "cat", meow: () => {} })).toBe("meow");
    });
});
```

### Testing Generic Constraints

```typescript
describe("generic constraints", () => {
    it("should enforce constraints", () => {
        function identity<T extends string>(value: T): T {
            return value;
        }

        const result = identity("hello");

        // Runtime test
        expect(result).toBe("hello");

        // Type test
        type cases = [
            Expect<AssertEqual<typeof result, "hello">>,
            // @ts-expect-error - number doesn't satisfy string constraint
            ReturnType<typeof identity<number>>
        ];
    });
});
```

---

## Quick Reference

### Commands

```bash
# Runtime tests
pnpm test                    # Run all tests (runtime + type)
pnpm test:runtime            # Run only runtime tests
pnpm test:runtime path/to/test  # Run specific runtime test file
pnpm test:runtime WIP        # Run only WIP runtime tests
pnpm test:runtime --exclude WIP  # Run all except WIP (regression check)

# Type tests
pnpm test:types              # Run all type tests
pnpm test:types GLOB         # Run type tests matching pattern
pnpm test:types WIP          # Run only WIP type tests

# Common patterns during development
pnpm test utils              # Test all utils (runtime + type)
pnpm test:runtime utils      # Test only runtime behavior of utils
pnpm test:types utils        # Test only types of utils
```

> NOTE: because we want `pnpm test` to pass the CLI parameters to _both_ the runtime and type tests we will need a small script to achieve this.

#### Test Script

The following script can saved as `/scripts/tests.mjs` and then you should make sure that the `package.json`'s "test" script is pointed to `node ./scripts/test.mjs`.

```ts
#!/usr/bin/env node

import { spawn } from 'child_process';

const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const args = process.argv.slice(2);

/**
 * Execute a command with inherited stdio
 * @param {string} command - The command to execute
 * @param {string[]} cmdArgs - Arguments for the command
 * @returns {Promise<void>}
 */
function exec(command, cmdArgs = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, cmdArgs, {
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    if (isCI) {
      // In CI (Github Actions), only run runtime tests
      console.log('\x1b[1mRuntime Tests (CI Mode)\x1b[0m');
      console.log('');
      await exec('pnpm', ['test:runtime', ...args]);
    } else {
      // Local development: run both runtime and type tests sequentially
      console.log('\x1b[1mRuntime Tests\x1b[0m');
      console.log('');
      await exec('pnpm', ['test:runtime', ...args]);

      console.log('');
      console.log('\x1b[1mType Tests\x1b[0m');
      console.log('');
      await exec('pnpm', ['test:types', ...args]);
    }
  } catch (error) {
    process.exit(1);
  }
}

main();
```

### Import Statements

```typescript
// For runtime tests
import { describe, it, expect } from "vitest";

// For type tests
import type {
    Expect,
    AssertTrue,
    AssertFalse,
    AssertEqual,
    AssertExtends,
    AssertSameValues,
    AssertContains
} from "inferred-types/types";
```

### Type Test Template

```typescript
describe("featureName", () => {
    it("test case description", () => {
        // Arrange: define test values/types
        const value = someFunction("input");
        type TestType = SomeUtility<"input">;

        // Act & Assert: runtime tests
        expect(value).toBe("expected");

        // Assert: type tests
        type cases = [
            Expect<AssertEqual<typeof value, "expected">>,
            Expect<AssertEqual<TestType, ExpectedType>>,
        ];
    });
});
```

---

### Mistake #5: Using @ts-expect-error to Mask Type Problems

**❌ WRONG - Never Do This:**

```typescript
it('should call function correctly', async () => {
  const service = myService('SomeEvent');

  // @ts-expect-error - TypeScript hits deep instantiation limits
  const result = await service.fn(mockPayload, mockResponse);

  expect(result).toBeUndefined();
});
```

**Why it's wrong:**

- **Masks the real problem** instead of fixing it
- Type errors are **fixable** - they indicate an actual issue to solve
- Future developers won't know why the error was suppressed
- Suppressed errors can hide breaking changes
- Shows you gave up instead of understanding the type system

**Common causes and fixes:**

1. **Generic type inference failing**
   - Fix: Explicitly specify type parameters: `service.fn<'PreToolUse'>(mockPayload, mockResponse)`
   - Fix: Properly type your mocks to match expected types

2. **Mock types don't match function signature**
   - Fix: Use proper type assertions on mocks: `mockPayload as HookPayload<'PreToolUse'>`
   - Fix: Ensure mock object structure matches interface exactly

3. **Complex generic constraints**
   - Fix: Break down into smaller typed pieces
   - Fix: Use helper types to simplify generic constraints

**✅ CORRECT - Fix the Type Error:**

```typescript
it('should call function correctly', async () => {
  const service = myService('SomeEvent');

  // Fix option 1: Explicit type parameter
  const result = await service.fn<'PreToolUse'>(mockPayload, mockResponse);

  // OR Fix option 2: Better mock typing
  const typedPayload: HookPayload<'PreToolUse'> = mockPayload;
  const result = await service.fn(typedPayload, mockResponse);

  expect(result).toBeUndefined();

  type cases = [
    Expect<AssertEqual<typeof result, void>>
  ];
});
```

**When to ask for help:**

If you genuinely cannot figure out how to fix a type error after trying:

1. Explicit type parameters
2. Proper mock typing
3. Interface alignment
4. Breaking down complex types

**STOP and ask the user for help.** Don't suppress the error.

**The only acceptable use of @ts-expect-error:**

- Legacy code you don't control
- Known TypeScript compiler bugs (with link to GitHub issue)
- Intentionally testing invalid types that should error

For **your own code in tests you're writing now**: Fix it, don't suppress it.

---

### Mistake #6: Over-Testing Types That TypeScript Already Guarantees

**❌ WRONG - Testing Function Signature:**

```typescript
it("should have correct signature", () => {
    const result = hasProgram("test");

    expect(typeof result).toBe("boolean");

    type cases = [
        // These are ALL redundant - TypeScript already enforces these!
        Expect<Parameters<typeof hasProgram>[0] extends string ? true : false>,
        Expect<Parameters<typeof hasProgram>["length"] extends 1 ? true : false>,
        Expect<ReturnType<typeof hasProgram> extends boolean ? true : false>
    ];
});
```

**Why it's wrong:**

- Function signature is enforced at compile time
- If parameter types or count were wrong, code wouldn't compile
- Every call site already validates the signature
- Wastes time testing what's impossible to break
- TypeScript's whole purpose is to guarantee these things

**When type tests actually add value:**

1. **Conditional return types** (type narrowing):

```typescript
// ✅ GOOD - tests interesting conditional type behavior
it("should narrow type for empty strings", () => {
    const emptyResult = hasProgram("");  // Type: false (literal)
    const validResult = hasProgram("sh");  // Type: boolean (wide)

    type cases = [
        Expect<typeof emptyResult extends false ? true : false>,  // Interesting!
        Expect<typeof validResult extends boolean ? true : false>
    ];
});
```

2. **Generic type inference**:

```typescript
// ✅ GOOD - tests that generics infer correctly
it("should infer literal types from input", () => {
    const literal = capitalize("hello");  // Should infer "Hello", not string

    type cases = [
        Expect<AssertEqual<typeof literal, "Hello">>  // Tests type narrowing
    ];
});
```

3. **Complex type transformations**:

```typescript
// ✅ GOOD - tests that utility type works correctly
it("should transform types correctly", () => {
    type Input = { readonly foo: string };
    type Output = Mutable<Input>;

    type cases = [
        Expect<AssertEqual<Output, { foo: string }>>  // Readonly removed
    ];
});
```

**What NOT to test:**

- ❌ Parameter types (function won't compile if called wrong)
- ❌ Parameter count (TypeScript enforces this)
- ❌ Basic return types without conditional logic (wide types like `boolean`, `string`)
- ❌ Interface shapes (TypeScript validates at compile time)

**Rule of thumb:**

- If it's a **wide type** (boolean, string, number) → Don't test the type
- If it's a **narrow/literal type** (false, "hello", 42) → Test the type
- If it's **conditional** (different types based on input) → Test the type
- If **TypeScript would catch it at compile time** → Don't test

**✅ CORRECT - Only test interesting type behavior:**

```typescript
it("should return boolean for non-empty strings, false for empty", () => {
    const empty = hasProgram("");
    const valid = hasProgram("sh");

    // Runtime tests
    expect(empty).toBe(false);
    expect(typeof valid).toBe("boolean");

    // Type tests - only the interesting narrowing behavior
    type cases = [
        Expect<typeof empty extends false ? true : false>,  // Narrow type
        Expect<typeof valid extends boolean ? true : false>  // Wide type
    ];
});
```

---

## Test Validation Checklist

**⚠️ MANDATORY: Complete this checklist AFTER writing tests, BEFORE moving to implementation**

For every test file you just wrote, verify:

### 1. Import Validation

- [ ] Imported from `inferred-types/types` (NOT just `inferred-types`)
- [ ] Using `AssertEqual`, `AssertExtends`, `AssertTrue`, etc. (NOT `Equal`, `Equals`)
- [ ] Imported `Expect` wrapper type

### 2. Structure Validation

- [ ] Every type test uses `type cases = [...]` array
- [ ] Every type assertion wrapped with `Expect<...>`
- [ ] Runtime and type tests in SAME `it()` blocks (NEVER separated)
- [ ] NO meaningless assertions like `expect(true).toBe(true)`

### 3. Value Capture Validation (MOST CRITICAL)

For EVERY test that includes type assertions, verify:

- [ ] Function is executed AND result CAPTURED in a variable
- [ ] Runtime value is tested with `expect(capturedValue)...`
- [ ] Type of captured value is tested with `Expect<AssertEqual<typeof capturedValue, ...>>`
- [ ] You are NOT testing abstract types in isolation (no `ReturnType<typeof func>` without captured values)

### 4. Pattern Comparison

Open this file and compare your tests to Example 2 ("Testing a Function with Narrow Return Type"):

- [ ] Does your test look similar to that example?
- [ ] Are you testing `typeof` captured variables, not abstract function signatures?
- [ ] Do you have intermediate variables that allow hovering for type inspection?

### 5. Final Verification

Run these commands:

```bash
pnpm test:runtime WIP  # Should pass
pnpm test:types WIP    # Should show "🎉 No errors!"
```

- [ ] Runtime tests pass
- [ ] Type tests pass with no errors
- [ ] No warnings about wrong assertion utilities

**If ANY checkbox is unchecked, your tests are INCORRECT. Fix them before proceeding to implementation.**

**DO NOT SKIP THIS CHECKLIST.** Testing mistakes caught here save hours of debugging and rework later.

---

## Common AI Mistakes

AI assistants (including Claude) frequently make these TypeScript testing errors. Learn to recognize and avoid them:

### Mistake #1: Testing Abstract Types Instead of Captured Values

**❌ WRONG - Most Common Mistake:**

```typescript
it('should have correct return type', async () => {
  // Function called but result NOT captured
  await logHookEvent('PreToolUse', payload);

  // Testing abstract function signature - BAD!
  type cases = [
    Expect<AssertEqual<ReturnType<typeof logHookEvent>, Promise<void>>>
  ];
});
```

**Why it's wrong:**

- Not testing an actual value - just the abstract signature
- No runtime test of the actual behavior
- Misses the whole point of integrated testing

**✅ CORRECT:**

```typescript
it('should have correct return type', async () => {
  // CAPTURED the result
  const result = await logHookEvent('PreToolUse', payload);

  // Runtime test on actual value
  expect(result).toBeUndefined();

  // Type test on CAPTURED variable
  type cases = [
    Expect<AssertEqual<typeof result, void>>
  ];
});
```

**Why it's correct:**

- Tests the actual runtime behavior (returns undefined)
- Tests the type of that specific returned value
- Runtime and type tests work together

---

### Mistake #2: Meaningless Dummy Assertions

**❌ WRONG:**

```typescript
it('should have correct types', () => {
  const result = myFunction('test');

  type cases = [
    Expect<AssertEqual<typeof result, string>>
  ];

  // Meaningless assertion added to "satisfy" test runner
  expect(true).toBe(true);
});
```

**Why it's wrong:**

- `expect(true).toBe(true)` tests nothing
- Added because developer didn't know they should test the actual value

**✅ CORRECT:**

```typescript
it('should have correct types', () => {
  const result = myFunction('test');

  // Test the ACTUAL value
  expect(result).toBe('expected-value');

  // Test the type
  type cases = [
    Expect<AssertEqual<typeof result, string>>
  ];
});
```

---

### Mistake #3: Wrong Import Paths

**❌ WRONG:**

```typescript
import type { Equal, Expect } from 'inferred-types';
// OR
import type { Equals, Expect } from 'inferred-types';
```

**Why it's wrong:**

- `Equal` and `Equals` are NOT test assertions - they're type utilities
- Missing `/types` in the import path
- Will cause cryptic type errors

**✅ CORRECT:**

```typescript
import type { AssertEqual, AssertExtends, Expect } from 'inferred-types/types';
```

---

### Mistake #4: Separated Runtime and Type Tests

**❌ WRONG:**

```typescript
describe('myFunction', () => {
  describe('runtime tests', () => {
    it('should work', () => {
      expect(myFunction('test')).toBe('result');
    });
  });

  describe('type tests', () => {  // ❌ SEPARATED!
    it('should have correct type', () => {
      const result = myFunction('test');
      type cases = [
        Expect<AssertEqual<typeof result, string>>
      ];
    });
  });
});
```

**Why it's wrong:**

- Runtime and type tests artificially separated
- Defeats the purpose of integrated TypeScript testing
- Makes tests harder to maintain

**✅ CORRECT:**

```typescript
describe('myFunction', () => {
  it('should work with correct type', () => {
    const result = myFunction('test');

    // Runtime test
    expect(result).toBe('expected');

    // Type test - SAME it() block
    type cases = [
      Expect<AssertEqual<typeof result, string>>
    ];
  });
});
```

---

### How AI Assistants Can Avoid These Mistakes

1. **ALWAYS capture function results** - never just call functions
2. **ALWAYS test the captured value** with `expect()` before type testing
3. **NEVER add dummy assertions** - test real values or skip runtime tests
4. **ALWAYS import from `inferred-types/types`** with the `/types` path
5. **NEVER use `Equal` or `Equals`** - use `AssertEqual`, `AssertExtends`, etc.
6. **ALWAYS integrate** - runtime and type tests in same `it()` block
7. **RUN THE VALIDATION CHECKLIST** before claiming tests are complete

---

## Summary

TypeScript testing requires understanding both runtime behavior and type correctness:

- **Type utilities** → Type tests only (no runtime behavior)
- **Simple functions** → Runtime tests minimum
- **Functions with narrow return types** → Both runtime and type tests
- **Classes with generics** → Both runtime and type tests

**Key principles:**

- Always use `type cases = [...]` for type tests
- Keep runtime and type tests in the SAME `it()` blocks
- Never create separate "Type Tests" describe blocks
- Use intermediate variables/types to allow type inspection
- Import assertions from `inferred-types/types`


