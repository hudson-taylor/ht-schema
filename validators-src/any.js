
"use strict";

var DELETEKEY = require("../lib/deleteKey");

function anyParser(args, childValidators, data) {

  if(data === undefined) {
    if(args.opt) {
      return DELETEKEY;
    }
    throw new Error("required Any value");
  } 

  return data;
    
}

module.exports = {
  name: "Any",
  fn:   anyParser
};
