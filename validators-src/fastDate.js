
"use strict";

function fastDateValidator(args, childValidators, data) {

  if(Object.prototype.toString.call(data) !== '[object Date]') {
    throw new Error("required date, received (" + typeof data + ") " + data.toString());
  }

  return data;
    
}

export default {
  name: "FastDate",
  fn:   fastDateValidator
};
