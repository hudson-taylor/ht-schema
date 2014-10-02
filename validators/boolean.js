
"use strict";

var DELETEKEY = require("../lib/deleteKey");

function boolParser(args, childValidators, data) {
    if(data === null && !args.opt) throw new Error("required Boolean");
    if(data === null && args.opt) return DELETEKEY;
    return Boolean(data);
}

module.exports = {
    name: "Boolean",
    fn:   boolParser
};
