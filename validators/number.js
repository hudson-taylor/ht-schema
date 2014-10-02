
"use strict";

var merge     = require("../lib/merge");
var DELETEKEY = require("../lib/deleteKey");

function numParser(args, childValidators, data) {
    args = merge(args, { min: null, max: null });
    if(!data && !args.opt) throw new Error("required Number");
    if(!data && args.opt) return DELETEKEY;
    var origType = typeof data;
    data = Number(data);
    if(isNaN(data)) throw new Error("required Number, recieved " + origType);
    if(args.min && data < args.min) {
        throw new Error("must be greater than " + args.min);
    }
    if(args.max && data > args.max) {
        throw new Error("must be less than or equal to " + args.max);
    }
    return data;
}

module.exports = {
    name: "Number",
    fn:   numParser
};
