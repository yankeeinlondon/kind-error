import { 
    SchemaApi__ArrayTuple, 
    SchemaApi__Atomic, 
    SchemaApi__Domain, 
    SchemaApi__Numeric, 
    SchemaApi__Object, 
    SchemaApi__String 
} from "./schema-api/index"


/**
 * **SchemaApi**
 *
 * The API surface used to define types.
 *
 * - all functions allow for no parameters but many offer variant configuration
 *   but passing in parameters too.
 */
export type SchemaApi = {
  kind: "SchemaApi";

  /**
   * creates a union type from the members listed
   */
  union: <const T extends readonly unknown[]>(...members: T) => T[number];

}
& SchemaApi__Atomic
& SchemaApi__String
& SchemaApi__Numeric
& SchemaApi__ArrayTuple
& SchemaApi__Object
& SchemaApi__Domain;
