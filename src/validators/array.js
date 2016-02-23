
"use strict";

const DELETEKEY = require("../deleteKey");

function arrayValidator(args, childValidators, data, key) {

  let out = [];

  if(!Array.isArray(data)) {
    if(args.opt) {
      return DELETEKEY;
    }
    let t = data === null ? 'null' : typeof data;
    throw new Error(`Got ${t}, expected Array`);
  }

  if(typeof args.length == 'number' && data.length !== args.length) {
    throw new Error(`Got ${data.length} elements, expected ${args.length}`);
  }

  if(typeof args.minLength == 'number' && data.length < args.minLength) {
    throw new Error(`Got ${data.length} elements, expected more than ${args.minLength}`);
  }

  if(typeof args.maxLength == 'number' && data.length > args.maxLength) {
    throw new Error(`Got ${data.length} elements, expected less than ${args.maxLength}`);
  }

  for(let i = 0; i < data.length; i++) {

    let val     = data[i];
    let matched = false;

    for(let v = 0; v < childValidators.length; v++) {
      if(!matched) {
        try {
          out.push(childValidators[v].parse(val, `${key}[${i}]`));
          matched = true;
          break;
        } catch(e) {
          // Pass!
        }
      }
    }

    if(!matched) {
      // We couldn't parse data[i] !
      throw new Error(`Error validating element ${key}[${i}]: ${e.message}`);
    }
  }
  return out;
}

arrayValidator.hasChildValidators = 'array';

export default {
  name: "Array",
  fn:   arrayValidator
};
