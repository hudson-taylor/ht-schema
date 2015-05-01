
"use strict";

const DELETEKEY = require("../lib/deleteKey");

function anyValidator(args, childValidators, data) {

  if(data === undefined) {
    if(args.opt) {
      return DELETEKEY;
    }
    throw new Error("required Any value");
  } 

  return data;
    
}

export default {
  name: "Any",
  fn:   anyValidator
};
