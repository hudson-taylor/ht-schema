
"use strict";

var DELETEKEY = require("../lib/deleteKey");

function boolParser(args, childValidators, data) {
    if(data === null && !args.opt) throw new Error("required Boolean");
    if(data === null || data === undefined && args.opt) return DELETEKEY;

    if(args.coerce) {
      return Boolean(data);
    }

    var type = typeof(data);

    if(type != "boolean") {
      throw new Error("Expected boolean, got: " + type);
    }

    return data;

}

module.exports = {
    name: "Boolean",
    fn:   boolParser
};
