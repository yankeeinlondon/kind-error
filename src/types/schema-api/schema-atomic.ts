export interface SchemaApi__Atomic {
  /** set the type to the wide `boolean` type */
  boolean: () => boolean;
  /** set the type to `true` */
  true: () => true;
  /** set the type to `false` */
  false: () => false;
  /** set the type to `null` */
  null: () => null;
  /** set the type to `undefined` */
  undefined: () => undefined;
}
