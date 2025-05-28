import { createKindError } from "src";


const FooBarType = createKindError("foo/bar");

const FooBar = FooBarType("Bad Juju", {
    bob: "yur uncle"
});

console.log(FooBar)
console.log(`\n-----------------------------------------------`);
console.log(`above is toString(), below is toJSON()`)
console.log(`-----------------------------------------------\n`);

console.log(JSON.stringify(FooBar));

console.log("\n");

console.log(`\n-----------------------------------------------`);
console.log(`above is toJSON(), below is throwing error`)
console.log(`-----------------------------------------------\n`);
throw FooBar;

