import type {
  Dictionary,
} from "inferred-types";
import type { inspect } from "node:util";



export type Stringifyable = string | boolean | number | null | Dictionary | Array<any> | Date;
