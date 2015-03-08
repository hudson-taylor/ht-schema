
"use strict";

const merge     = require("../lib/merge");
const DELETEKEY = require("../lib/deleteKey");

function numParser(args, childValidators, data) {
    args = merge(args, { min: null, max: null });

    if(data === undefined) {
        if(args.opt) {
            return DELETEKEY;
        }
        throw new Error("required Number");
    }

    let origType = typeof data;
    data = Number(data);
    if(isNaN(data)) throw new Error("required Number, received " + origType);
    if(args.min && data < args.min) {
        throw new Error("must be greater than " + args.min);
    }
    if(args.max && data > args.max) {
        throw new Error("must be less than or equal to " + args.max);
    }
    return data;
}

export default {
    name: "Number",
    fn:   numParser
};
