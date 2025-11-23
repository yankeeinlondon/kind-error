#!/usr/bin/env bun run 

import {
    createKindError
} from "~"

const InvalidType = createKindError("invalid-type", {
    lib: "kind-error"
});

function three() {
    console.log(InvalidType.toString());
    console.log(InvalidType("uh oh"));
}

function two() {
    three()
}

function one() {
    two()
}

one();
