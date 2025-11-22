# Kind Error Type Schemas

There are some advanced type utilities included in this repo to allow for runtime expression of Typescript types. This allows a `KindErrorRule` to define a context schema which is composed of  scalar values (treated as literal constants) and schema callback functions which allow for the creation of virtually _any_ required type.

Here's an example of how one might configure the schema for a `KindErrorType`:

```ts
const MyError = createKindError("my-error", {
    lib: "kind-error",
    scope: t => t.string("one","two","three"),
    color: t => t.optString("foo", "bar", "baz")
})
```

In the example we have:

- a `lib` property which is seen as a static/constant key/value of `{ lib: "kind-error" }`.
  - When an error is being created the context object presented at that point WILL NOT include `lib` because this has already been expressed in the error type.
- a `scope` property which is defined as a union of the string literals `one`, `two`, and `three`.
  - When an error is being created the context object will see `scope` as a **required** property and force the caller to define it to one of the values in the union.
- the `color` property is defined as an _optional_ union type of `foo`, `bar`, and `baz`. Therefore when creating an error of this type, setting `color` will be allowed but not required.

## The Schema Type System

### Core Types

The types which make this schema system work start with these core types:

- `SchemaApi` 
  - the API surface a caller can use when defining a `SchemaCallback` to define a type
- `SchemaCallback` 
  - the definition of the callback (e.g., `t => t.string()`) structure to use when defining a type
- `SchemaResult<T>` 
  - a type utility which will determine the _type_ of the `SchemaCallback` provided.
- `RuntimeTokenCallback`
  - schema's which use a `SchemaCallback` to define type return:
    - the _type_ they represent to the type system, but
    - they return a `RuntimeTokenCallback` to the runtime system
  - a `RuntimeTokenCallback` is a function which takes zero parameters and returns a `RuntimeToken`.
- `RuntimeToken`
  - a string literal which always looks like `<<${string}>>`
  - be careful at visual inspection as the tokens are meant to be visibly clear to human evaluation but they intentionally contain special strings which are there to ensure easier parsing.

### Schema Primitives

We have three types which represent the _schema primitives_ that provide the structure/shape for our schema definitions:

- `SchemaProperty`
  - the primary "building block" for schemas
  - represents either:
    - a `Scalar` value,
    - or a `SchemaCallback`

- `SchemaDictionary` 
  - a key/value dictionary, where the _values_ are `SchemaProperty`'s

- `SchemaTuple`
  - a tuple where each element is a `SchemaProperty`

### Schema Type Utilities


- `FromSchema<T>`
  - converts a `SchemaProperty`, `SchemaDictionary`, or `SchemaTuple` into the _type_ which is represented by the underlying
  - this has NO impact on the runtime values (it can't as it's just a type utility)
- `AsRuntimeTok


