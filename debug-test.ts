import { createKindError } from './src/createKindError';
import { err } from 'inferred-types';

console.log("=== Debug Test ===");

const t1 = createKindError("my>error", {});
const t2 = createKindError("my[error]", {});
const e = err("foo");

console.log("t1:", t1);
console.log("t1 instanceof Error:", t1 instanceof Error);
console.log("t1.constructor.name:", t1.constructor.name);
console.log("typeof t1:", typeof t1);
console.log("t1.__kind:", (t1 as any).__kind);

console.log("\nt2:", t2);
console.log("t2 instanceof Error:", t2 instanceof Error);
console.log("t2.constructor.name:", t2.constructor.name);
console.log("typeof t2:", typeof t2);
console.log("t2.__kind:", (t2 as any).__kind);

console.log("\ne:", e);
console.log("e instanceof Error:", e instanceof Error);
console.log("e.constructor.name:", e.constructor.name);
console.log("typeof e:", typeof e);