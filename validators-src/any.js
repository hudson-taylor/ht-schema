
"use strict";

import DELETEKEY from "../lib/deleteKey";

function anyParser(args, childValidators, data) {

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
  fn:   anyParser
};
