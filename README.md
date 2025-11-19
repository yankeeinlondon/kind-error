# Kind Error

> A better error primitive for Javascript/Typescript.

## Install

Using pnpm:

```sh
pnpm install @yankeeinlondon/kind-error
```

<details>

<summary>
Alternatives
</summary>
<br/>

| <span style="font-weight: 200">Manager</span>| <span style="font-weight: 200">Shell Command</span> |
| --- | --- |
| **npm** | npm install @yankeeinlondon/gotcha  |
| **pnpm** | pnpm add @yankeeinlondon/gotcha | 
| **yarn** | yarn add @yankeeinlondon/gotcha | 
| **bun** | bun add @yankeeinlondon/gotcha | 

</details>

## Usage

1. Create an Error _type_ with first call to `createKindError`:

   ```ts
   const InvalidRequest = createKindError("invalid-request", { lib: "foobar", url: "string" });
   ```

   The error type `InvalidRequest` has now been created as a `KindErrorType`:

   - it acts as a function which will produce an error with the following properties:
       - `name` - the _name_ is the PascalCase version of what you called it (e.g., `InvalidRequest`)
       - `kind` - the _kind_ is the kebab-cased version of what you called it (e.g., `invalid-request`)
       - `type` - the _type_ is the _kind_ string up to but not including a `/` character
       - `subType` - the _subType_ is the _kind_ string after the first `/` character:
         - if there is no `/` character in the `kind` then subType is _undefined_
         - you may provide a union type for the subType by using the `|` character:
           - `invalid-request/get | post | put | delete` 
           - will make the **subType** `"get" | "post" | "put" | "delete"`
           - when you express the subtype as a union type, this will change the signature of calling this type:
             - The default calling signature is `ErrorType(message, props)` (where `props` is potentially optional if there are no required props in the )
       - `stackTrace` - a structured stack trace
       - **context**
         - any properties passed into the second parameter help define the _shape_ of the error
         - In our example the `lib` and `url` properties have been set:
           - because `lib` is a non-union string literal it is a fixed property and error created will always have a static property of `lib` that equals `foobar`.
           - because `url` is both _required_ and a _wide_ type that means that calling the function will **require** that the `url` property be included!


2. Creating an Error from an Error Type:

     ```ts
     throw InvalidRequest("oh no!"); // invalid
     ```

    Because we defined `url` as required but gave it a _variant_ type, the syntax above will throw a typescript error and not compile. This mechanism is powerful as it enforces that required properties (which are _variant_ in value) must be included when producing the error.

     ```ts
     throw InvalidRequest("oh no!", { url: "https://google.com" }); // valid
     ```

    Now we've addressed the `url` constraint and the error will be produced without any issue.

    ```ts
    throw InvalidRequest("oh no!", { url: "https://google.com", color: "red" }); // invalid
    ```

    By default a `KindErrorType` is _strict_ about the properties it allows for. This means that if you want to add a `color` property you'd have to have included it in the schema for the type. You can, however, add optional parameters to a type so that `color` is not required but _can_ be included if so desired.


### Rebasing

After you've defined an error type like `InvalidRequest` from above, but before we generate the
error, we can "rebase" it with additional context.

```ts
const InvalidRequest = createKindError("invalid-request", { lib: "foobar" });
// ...

const IR2 = InvalidRequest.rebase({
   handler: "bar"
})
```

### Proxying Errors

```ts
try {
    //...
}
catch (err) {
    throw InvalidRequest.proxy(err, { url: "unknown"});
}
```

The `KindErrorType` provides a convenient `.proxy(err)` method which will take in any error type.

- if the error received is already a blessed `KindError` then it is simply proxied through "as is"
- if the error is _not_ a `KindError` then:
  - The error will be converted to the kind error's type/subType and name.
  - The message from the underlying error will be placed into the message property of this error
  - The callstack of the underlying error will be converted to a structured format and used as the callstack for the KindError
  - The property `underlying` will be set to the underlying error's payload in case there are more details that can be extracted

**Note:** just like in our previous example, any required properties of the schema must be provided when proxying an error through. These properties will serve as a way to ensure that the type of the error _can_ be produced. If however, the underlying error has the same property AND it is of the right type then it will override the value at runtime.

## Type Guards

Type guards help us _narrow_ the type at runtime and because the errors this repo produces have so much potential for literal types, we include some type guards to help you:

1. `isKindError(val)` this type guard will establish whether the variable `val` is a valid `KindError` or not. From this we will get literal types for name, type, subType, and typically message. 
2. `KindErrorType.is(val)` each type definition comes with a `is(val)` type guard built in. This type guard will resolve not only the basic properties of a KindError but all properties defined in that particular error's schema.

## Structured Callstack and Pretty Print

All `KindError`'s will parse the string based callstack found in 
