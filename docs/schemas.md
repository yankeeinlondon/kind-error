# Kind Error Type Schemas

The `kind-error` library includes a powerful schema system that allows `KindErrorType` definitions to express TypeScript types at runtime. This enables strict typing for error context, distinguishing between static (constant) context and dynamic (required/optional) context.

## Defining a Schema

When creating a `KindErrorType` using `createKindError`, you can provide a schema dictionary. This dictionary defines the shape of the context object that instances of this error will carry.

```ts
import { createKindError } from "@yankeeinlondon/kind-error";

const MyError = createKindError("my-error", {
    // Static Context (Literal)
    lib: "kind-error", 
    
    // Dynamic Context (Schema Callbacks)
    scope: t => t.string("one", "two", "three"),
    retryCount: t => t.number(),
    color: t => t.optString("red", "blue")
});
```

### Static vs. Dynamic Context

The schema distinguishes between two types of properties:

1. **Static Context (Literals):**
    * Defined as direct scalar values (string, number, boolean).
    * Example: `lib: "kind-error"`
    * **Behavior:** These values are *automatically* added to every `KindError` instance created from this type. The user *does not* need to provide them when throwing the error.

2. **Dynamic Context (Schema Callbacks):**
    * Defined using a `SchemaCallback` function (e.g., `t => t.string()`).
    * Example: `scope: t => t.string(...)`
    * **Behavior:** These define the *shape* of the data the user must (or may) provide when throwing the error.
        * **Required:** If the type is required (e.g., `t.string()`), the `createKindError` factory will require it in the second argument.
        * **Optional:** If the type is optional (e.g., `t.optString()`), the property is optional in the factory function.

## Creating Error Instances

Based on the schema defined above, the `MyError` factory will have the following signature:

```ts
// Valid
const err = MyError("Something went wrong", { 
    scope: "one", 
    retryCount: 5 
});
// err.context includes: { lib: "kind-error", scope: "one", retryCount: 5 }

// Valid (with optional 'color')
const err2 = MyError("Colors!", { 
    scope: "two", 
    retryCount: 1, 
    color: "red" 
});

// Invalid (missing required 'retryCount')
// TS Error: Property 'retryCount' is missing...
const err3 = MyError("Oops", { scope: "one" }); 
```

## The Schema Type System

The schema system relies on a set of core types to bridge the gap between runtime definitions and TypeScript's type system.

### Core Types

* **`SchemaApi`**: The API surface provided to the callback function (`t`). It offers methods like `string()`, `number()`, `boolean()`, `array()`, `tuple()`, `union()`, etc.
* **`SchemaCallback`**: A function that receives `SchemaApi` and returns a schema definition.
  * Signature: `(t: SchemaApi) => unknown`
* **`SchemaDictionary`**: A key/value map where values can be `Scalar` (static) or `SchemaCallback` (dynamic).
* **`SchemaResult<T>`**: A utility type that extracts the *TypeScript type* represented by a `SchemaCallback`.
* **`FromSchema<T>`**: A powerful utility that converts a `SchemaDictionary` (or property/tuple) into its resolved TypeScript type.
  * `FromSchema<{ val: t => t.number() }>` resolves to `{ val: number }`.

### Runtime Tokens

Under the hood, `SchemaCallback` functions return **Runtime Tokens** (strings like `<<string>>` or `<<union::foo|bar>>`). These tokens are used by the runtime system (e.g., for validation or serialization) while the TypeScript compiler uses the `FromSchema` utility to infer the correct static types.

This dual nature allows `kind-error` to provide both:

1. **Compile-time safety:** ensuring you pass the correct context data.
2. **Runtime introspection:** allowing tools to inspect the expected structure of error types.

## Runtime Support

The runtime system provides several functions to help in the implementation of schemas. This includes:

* `schemaProperty()`
* `schemaObject()`
* `schemaTuple()`

These three functions provide various ways to leverage the type utilities while manipulating the runtime system to ensure that the runtime is able to provide consistently narrow schema types.
