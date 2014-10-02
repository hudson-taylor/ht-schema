
"use strict";

var merge     = require("../lib/merge");
var DELETEKEY = require("../lib/deleteKey");

function strParser(args, childValidators, data) {
    args = merge(args, { min: null, max: null, enum: null });
    if(!data && !args.opt) throw new Error("required String");
    if(!data && args.opt) return DELETEKEY;
    var type = typeof data;
    if(type !== "string") throw new Error("required String, recieved " + type + ", " + data);
    if(args.min !== null && data.length < args.min) {
        throw new Error("string length must be greater than " + args.min);
    }
    if(args.max !== null && data.length > args.max) {
        throw new Error("string length must be less than or equal to " + args.max);
    }
    if(Array.isArray(args.enum)) {
        var match = false;
        for(var i = 0; i < args.enum.length; i++) {
            if(args.enum[i] == data) {
                match = true;
                break;
            }
        }
        if(!match) throw new Error("string does not match enum: " + args.enum);
    }
    return data;
}

module.exports = {
    name: "String",
    fn:   strParser
};
