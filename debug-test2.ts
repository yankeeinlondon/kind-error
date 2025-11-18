import { createKindError } from './src/createKindError';
import { err } from 'inferred-types';

console.log("=== Debug Test 2 ===");

const t1 = createKindError("my>error", {});
const t2 = createKindError("my[error]", {});
const e = err("foo");

// Create actual error instances by calling the constructors
const t1Instance = t1("test message");
const t2Instance = t2("test message");

console.log("t1 (constructor):", t1);
console.log("t1Instance:", t1Instance);
console.log("t1Instance instanceof Error:", t1Instance instanceof Error);
console.log("t1Instance.constructor.name:", t1Instance.constructor.name);

console.log("\nt2 (constructor):", t2);
console.log("t2Instance:", t2Instance);
console.log("t2Instance instanceof Error:", t2Instance instanceof Error);
console.log("t2Instance.constructor.name:", t2Instance.constructor.name);

console.log("\ne:", e);
console.log("e instanceof Error:", e instanceof Error);
console.log("e.constructor.name:", e.constructor.name);