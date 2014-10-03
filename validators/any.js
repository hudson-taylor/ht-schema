
"use strict";

var DELETEKEY = require("../lib/deleteKey");

function anyParser(args, childValidators, data) {
    if(data === undefined && args.opt) return DELETEKEY;
    return data;
}

module.exports = {
    name: "Any",
    fn:   anyParser
};
