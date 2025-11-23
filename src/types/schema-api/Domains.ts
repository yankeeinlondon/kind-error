import type { 
    EndsWith, 
    Ip4Octet, 
    NumericChar, 
    NumericChar__ZeroToFive, 
    NumericChar__ZeroToFour, 
    StripAfter, 
    Suggest 
} from "inferred-types";
import type { FromSchemaTuple, SchemaCallback } from "~/types";

export type EmailDomain = `${string}.${string}` | SchemaCallback;

/**
 * **Email**`<[T]>`
 *
 * A type for emails.
 */
export type Email<T extends readonly EmailDomain[] = []> = [] extends T
  ? `${string}@${string}.${string}`
  : FromSchemaTuple<T> extends infer Constraint extends readonly string[]
    ? `${string}@${Constraint[number]}`
    : never;

export type NetmaskSuggest = Suggest<
  | `10.0.0.0/8`
  | "192.168.0.0/16"
  | "192.168.1.0/24"
  | "192.168.10.0/24"
  | "192.168.20.0/24"
  | "192.168.30.0/24"
  | "192.168.40.0/24"
  | "192.168.50.0/24"
  | "192.168.60.0/24"
  | "192.168.70.0/24"
  | "192.168.80.0/24"
  | "192.168.90.0/24"
  | "192.168.100.0/24"
>;

type NumericChar_OneToNine = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

/**
 * **Ip4Octet**
 *
 *
 */
export type Ipv4Octet
  = | NumericChar
    | `${NumericChar_OneToNine}${NumericChar}`
    | `1${NumericChar}${NumericChar}`
    | `2${NumericChar__ZeroToFour}${NumericChar}`
    | `25${NumericChar__ZeroToFive}`;

/**
 * Network IPv4 Netmask.
 */
export type Netmask = `${Ipv4Octet}.0.0.0/8`
  | `${Ipv4Octet}.${number}.0.0/16`
  | `${number}.${number}.${number}.0/24`
  | `${number}.${number}.${number}.${number}/32`;

export type CreateNetmask = `/8` | `/16` | `/24` | `/32`;

type v4 = `${Ipv4Octet}.${number}.${number}.${number}`;

/**
 * **Ip4Address**
 *
 * IP version 4 internet address.
 */
export type Ip4Address<T extends Netmask | CreateNetmask | undefined = undefined> = T extends Netmask
  ? EndsWith<T, "32"> extends true
    ? v4
    : EndsWith<T, "24"> extends true
      ? T extends `${infer A extends number}.${infer B extends number}.${infer C extends number}${string}/24`
        ? `${A}.${B}.${C}.${Ipv4Octet}`
        : never
      : EndsWith<T, "16"> extends true
        ? T extends `${infer A extends number}.${infer B extends number}.0.0/16`
          ? `${A}.${B}.${number}.${Ipv4Octet}`
          : never
        : EndsWith<T, "8"> extends true
          ? StripAfter<T, "."> extends infer A extends string
            ? `${A}.${number}.${number}.${Ip4Octet}`
            : never
          : never
  : T extends "/8"
    ? `${Ipv4Octet}.0.0.0`
    : T extends "/16"
      ? `${Ipv4Octet}.${Ip4Octet}.0.0`
      : T extends "/24"
        ? `${Ipv4Octet}.${Ip4Octet}.${number}.0`
        : v4;

/**
 * Domain specific literals which are part of the `SchemaApi`
 */
export interface SchemaApi__Domain {
  /**
   * Type for an email address.
   *
   * - if no parameters then the type will be sufficiently wide to allow
   *   all valid email addresses.
   */
  email: <const T extends readonly EmailDomain[]>(
    ...constraints: T
  ) => [] extends T ? Email : Email<T>;

  /**
   * **IPv4 Address**
   *
   * - you may filter down to just a particular Netmask with `/8`, `/16`, etc.
   * - you may also provide a fully qualified Netmask like `192.168.1.0/24`
   *   and this will
   */
  ip4Address: <const T extends CreateNetmask | Netmask | undefined>(filter?: T) => Ip4Address<T>;
}
