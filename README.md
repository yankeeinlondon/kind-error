# Kind Error

> A better error primitive than what Javascript hands you.

## Usage

1. Create an Error _type_ with first call to `createKindError`:

   ```ts
   const InvalidRequest = createKindError("invalid-request", { lib: "foobar" });
   ```

2. Throw an error of this type:

     ```ts
     throw InvalidRequest("oh no!");
     ```

     you may optionally adding additional "context" to the error when you throw it:

     ```ts
     throw InvalidRequest("oh no!", { params: [ "foo", "bar"]});
     ```

In this example the person catching the error would find `params` and `lib` set on
the error's "context" property.

### Rebasing an Error prior to throwing

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

The `KindErrorType` provides a convenient `.proxy(err)` method which will take in any error type.

- if the error received is a `KindError` then it is simply passed/proxied through
- if the error is _not_ a `KindError` then it will be wrapped as a KindError by adding the underlying error as a context property called `underlying`. The new error message will also proxy the underlying error's message.

## Type Guards

There is a general type guard provided as `isKindError()` which you can import and use to validate
that a given error _is_ a **KindError**. Furthermore, if you want to check for a specific _variant_ of a `KindError` you can use the `.is(val)` method off of the `KindErrorType`.

## Benefits Summary

1. Context

   As was indicated in our example above we provide a "context" property which is a dictionary of
   key/value pairs you can defined either at the time you define the error type or at the actual error being thrown.

   > **Note:** if you set the same key both setting up the error type and again when throwing the 
   error, the latter key/value will overwrite the former.

2. Kind

   When you create you're error with the call to `createKindError(kind, ctx)` the first parameter will define the "kind" of error this is. By the time your error is thrown, the "kind" and "name"
   properties of your error will be set based on this. The "kind" property is a dasherized version 
   of the kind and the "name" property is a PascalCase version of the kind.

3. Type Support When Catching Errors

   Every attempt is made to preserve types during error creation but when catching errors
   we have provided the `isKindError(val)` type guard which will bring back good type support
   to tap into the "context", "type", "stack" and "kind" properties.

4. Error Stack

    Javascript return a _string_ for a stack trace and requires us to parse it. When you use a
    KindError you will be provided a `stackTrace` property which is an array of stack items,
    where a stack item is:

    ```ts
    type StackItem = {
      file: string | undefined;
      function?: string;
      args?: any[];
      col?: number;
      line?: number;
      raw?: string;
    }
    ```

    Finally, a `file`, `line`, and `col` property are directly exposed for the top item in the stack.
