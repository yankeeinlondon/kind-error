import { describe, it } from "vitest";
import {
    Expect,
    AssertExtends, 
    Not
} from "inferred-types/types";
import { Ip4Address } from "~/types";



describe("Ip4Address", () => {

    it("no masking", () => {
        type T = Ip4Address;

        type cases = [
            Expect<AssertExtends<"192.168.1.1", T>>,
            Expect<AssertExtends<"10.10.100.1", T>>,
            Expect<AssertExtends<"0.0.0.0", T>>,
            Expect<AssertExtends<"255.255.255.255", T>>,

            Expect<Not<AssertExtends<"256.0.0.0", T>>>,
        ];
    });

    
    it("filter using a mask", () => {
        type T8 = Ip4Address<"/8">;
        type T16 = Ip4Address<"/16">;
    
        type cases = [
            /** type tests */
        ];
    });

    
    it("define an IP within a specified netmask", () => {
        type T24 = Ip4Address<"192.168.1.0/24">;
        type T16 = Ip4Address<"192.168.0.0/16">;
        type T8 = Ip4Address<"10.0.0.0/8">;
    
        type cases = [
            Expect<AssertExtends<"192.168.1.0", T24>>,
            Expect<AssertExtends<"192.168.1.128", T24>>,
            Expect<AssertExtends<"192.168.1.255", T24>>,

            Expect<Not<AssertExtends<"192.168.2.0", T24>>>,
            Expect<Not<AssertExtends<"192.168.1.266", T24>>>,

        ];
    });
    
    

});
