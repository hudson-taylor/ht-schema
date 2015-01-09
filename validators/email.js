
"use strict";

var isemail = require("isemail");

var merge     = require("../lib/merge");
var DELETEKEY = require("../lib/deleteKey");

function emailParser(args, childValidators, data) {
    args = merge(args, { normalize: true });
    if(!data && !args.opt) throw new Error("required Email address");
    if(!data && args.opt) return DELETEKEY;
    var type = typeof data;
    if(type !== "string") throw new Error("required String Email, received " + type + ", " + data);
    data = data.trim();
    if(args.normalize) data = data.toLowerCase();
    if(!isemail(data)) throw new Error("Invalid Email: " + data);
    return data;
}

module.exports = {
    name: "Email",
    fn:   emailParser
};
