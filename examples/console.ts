import { createKindError } from "src";

const Invalid = createKindError("InvalidFormat", { foo: "testing" });

const err = Invalid("uh oh, I did it again", { bar: 42 });

console.log(err.asConsoleMessage())
