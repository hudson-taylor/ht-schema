
"use strict";

var isemail = require("isemail");

var merge     = require("../lib/merge");
var DELETEKEY = require("../lib/deleteKey");

function emailParser(args, childValidators, data) {
    args = merge(args, { normalize: true });

    if(data === undefined) {
        if(args.opt) {
            return DELETEKEY;
        }
        throw new Error("required Email address");
    }

    var type = typeof data;

    if(type !== "string") {
        throw new Error("required String Email: got " + type);
    }

    data = data.trim();

    if(args.normalize) {
        data = data.toLowerCase();
    }

    if(!isemail(data)) {
        throw new Error("Invalid Email: " + data);
    }

    return data;

}

module.exports = {
    name: "Email",
    fn:   emailParser
};
