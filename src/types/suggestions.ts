import type { Suggest } from "inferred-types";

export type RecordKeySuggestions = Suggest<"string" | `_${string}` | `"foo" | "bar"`>;
