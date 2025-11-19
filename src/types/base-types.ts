import type {
  Dictionary,
} from "inferred-types";

export type Stringifyable = string | boolean | number | null | Dictionary | Array<any> | Date;
