
"use strict";

var merge     = require("../lib/merge");
var DELETEKEY = require("../lib/deleteKey");

function strParser(args, childValidators, data) {

    // Merge optional values into args so we can still test for them
    args = merge(args, { min: null, max: null, enum: null, trim: null, lower: null, upper: null, regex: null });

    // If we have no data, and this value is not optional, throw
    if(!data && !args.opt) {
        throw new Error("required String");
    }

    // Else, return DELETEKEY so the key is deleted from the
    // object that is sent to the service
    if(!data && args.opt) {
        return DELETEKEY;
    }

    // Basic typechecking
    var type = typeof data;

    if(type !== "string") {
        throw new Error("required String, recieved " + type + ", " + data);
    }

    // Extra options, check min/max length
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

    // Throw if both lower & upper are true
    if(args.lower === true && args.upper === true) {
        throw new Error("string options cannot set both lower and upper");
    }

    if(args.lower === true) {
        data = data.toLowerCase();
    }

    if(args.upper === true) {
        data = data.toUpperCase();
    }

    // Check if the user supplied a regex to match
    if(Object.prototype.toString.call(args.regex) == "[object RegExp]") {
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

    // Data passes all tests, return
    return data;

}

module.exports = {
    name: "String",
    fn:   strParser
};
