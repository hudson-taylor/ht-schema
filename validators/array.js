
"use strict";

var DELETEKEY = require("../lib/deleteKey");

function arrayParser(args, childValidators, data, key) {
    childValidators = childValidators || [];
    var out = [];

    if(!Array.isArray(data)) {
        if(args.opt) {
            return DELETEKEY;
        }
        throw new Error("required Array");
    }

    if(typeof args.length == 'number' && data.length !== args.length) {
        throw new Error("required array with " + args.length + " items, got: " + data.length);
    }

    if(typeof args.minLength == 'number' && data.length < args.minLength) {
        throw new Error("required array wtith minimum " + args.length + " items, got: " + data.length);
    }

    if(typeof args.maxLength == 'number' && data.length > args.maxLength) {
        throw new Error("required array with maximum " + args.length + " items, got: " + data.length);
    }

    for(var i = 0; i < data.length; i++) {
        
        var val     = data[i];
        var matched = false;
        
        for(var v = 0; v < childValidators.length; v++) {
            if(!matched) {
                try {
                    out.push(childValidators[v].parse(val, key + "[" + i + "]"));
                    matched = true;
                    break;
                } catch(e) {
                    //pass!
                }
            }
        }
        if(!matched) {
            //We couldn't parse data[i] !
            throw new Error("No matching validator for " + key + "[" + i + "]");
        }
    }
    return out;
}

module.exports = {
    name: "Array",
    fn:   arrayParser
};
