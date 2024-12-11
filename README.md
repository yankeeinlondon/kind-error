# Kind Error

> A better error primitive than what Javascript hands you.

## Usage

1. Create an Error _type_ with first call to `createKindError`:

  ```ts
  const InvalidRequest = createDindError("invalid-request", { lib: "foobar" });
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

Every attempt is made to preserve types thoughtout this process so that downstream
callers will be able to use the provided `isKindError()` type guard to narrow the
type so the person handling the error has a autocomplete experience when trying to
leverage the context that is available.
