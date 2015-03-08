
"use strict";

const sanitizer = require("sanitizer");

const merge     = require("../lib/merge");
const DELETEKEY = require("../lib/deleteKey");

function strParser(args, childValidators, data) {

    // Merge optional values into args so we can still test for them
    args = merge(args, { len: null, min: null, max: null, enum: null, trim: null, lower: null, upper: null, regex: null });

    // Throw if both lower & upper are true
    if(args.lower === true && args.upper === true) {
        throw new Error("string options cannot set both lower and upper");
    }

    // If we have no data, and this value is not optional, throw
    if(!data && !args.opt) {
        throw new Error("required String");
    }

    // If not, return DELETEKEY so the key is deleted from the
    // object that is sent to the service
    if(!data && args.opt) {
        return DELETEKEY;
    }

    // Basic typechecking
    let type = typeof data;

    if(type !== "string") {
        throw new Error("required String, received " + type + ", " + data);
    }

    // Extra options, check length etc.

    if(args.len !== null && data.length != args.len) {
        throw new Error("string length must be " + args.len);
    }

    if(args.min !== null && data.length < args.min) {
        throw new Error("string length must be greater than " + args.min);
    }

    if(args.max !== null && data.length > args.max) {
        throw new Error("string length must be less than or equal to " + args.max);
    }

    // Order of precedence should coerce values before they
    // are matched against the regex, and checked for enum.

    if(args.trim === true) {
        data = data.trim();
    }

    if(args.lower === true) {
        data = data.toLowerCase();
    }

    if(args.upper === true) {
        data = data.toUpperCase();
    }

    // Check if the user supplied a regex to match
    if(args.regex) {

        if(Object.prototype.toString.call(args.regex) != "[object RegExp]") {
            try {
                args.regex = RegExp(args.regex);
            } catch(e) {
                throw new Error("invalid regex specified: " + args.regex.toString());
            }
        }

        if(!args.regex.test(data)) {
            throw new Error("string does not match regex: " + args.regex.toString());
        }

    }

    // Check if the user passed an array of
    // allowed values, if they did, check the
    // data we got matches one of them.
    if(Array.isArray(args.enum)) {
        if(!args.enum.some(function(v) {
            return v == data;
        })) {
            throw new Error("string does not match enum: " + args.enum);
        }
    }

    if(args.sanitize) {
        data = sanitizer.escape(data);
    }

    // Data passes all tests, return
    return data;

}

export default {
    name: "String",
    fn:   strParser
};
