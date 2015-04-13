
"use strict";

const DELETEKEY = require("../lib/deleteKey");

function typedArrayParser(args, childValidators, data, key) {

    let out = [];

    if(!Array.isArray(data)) {
        if(args.opt) {
            return DELETEKEY;
        }
        throw new Error("required Array");
    }

    if(data.length !== childValidators.length) {
        throw new Error("Got " + data.length + " elements, expected " + childValidators.length);
    }

    for(var i = 0; i < childValidators.length; i++) {
        let keyId = `${key}[${i}]`;
        try {
            out.push(childValidators[i].parse(data[i], keyId));
        } catch(e) {
            throw new Error("Error validating element in position " + i + ": " + e.message);
        }
    }

    return out;

}

typedArrayParser.hasChildValidators = true;

export default {
    name: "TypedArray",
    fn:   typedArrayParser
};
