
"use strict";

function fastDateValidator(args, childValidators, data) {

  if(Object.prototype.toString.call(data) !== '[object Date]') {
    throw new Error(`Got ${typeof data}, required Data`);
  }

  return data;

}

export default {
  name: "FastDate",
  fn:   fastDateValidator
};
