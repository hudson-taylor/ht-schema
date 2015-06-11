
"use strict";

const DELETEKEY = require("../lib/deleteKey");

function typedArrayValidator(args, childValidators, data, key) {

  let out = [];

  if(!Array.isArray(data)) {
    if(args.opt) {
      return DELETEKEY;
    }
    let t = data === null ? 'null' : typeof data;
    throw new Error(`Got ${t}, expected Array`);
  }

  if(data.length !== childValidators.length) {
    throw new Error(`Got ${data.length} elements, expected ${childValidators.length}`);
  }

  for(var i = 0; i < childValidators.length; i++) {
    let keyId = `${key}[${i}]`;
    try {
      out.push(childValidators[i].parse(data[i], keyId));
    } catch(e) {
      throw new Error(`Error validating element ${keyId}: ${e.message}`);
    }
  }

  return out;

}

typedArrayValidator.hasChildValidators = 'array';

export default {
  name: "TypedArray",
  fn:   typedArrayValidator
};
