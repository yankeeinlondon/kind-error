

/**
 * the numeric-based type definition of `SchemaApi`
 */
export type SchemaApi__Numeric = {

    /**
     * a wide number (with no params), a numeric literal (with one param), or a
     * numeric literal union (with multiple params).
     */
    number<T extends readonly number[]>(...literals: T): [] extends T ? number : T[number];

    /**
     * an _optional_ wide number (with no params), an _optional_ numeric literal (with one param), 
     * or an _optional_ numeric literal union (with multiple params).
     */
    optNumber<T extends readonly number[]>(...literals: T): [] extends T ? number | undefined : T[number] | undefined;

    /**
     * Make type a `BigInt`
     */
    bigInt(): BigInt;

    /**
     * Make type an _optional_ `BigInt`
     */
    optBigInt(): BigInt | undefined;
}
