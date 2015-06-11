
"use strict";

function fastStrValidator(args, childValidators, data) {

  // If we have no data, and this value is not optional, throw
  if(data === undefined) {
    throw new Error(`Got undefined, required String`);
  }

  // Basic typechecking
  let type = typeof data;

  if(type !== "string") {
    throw new Error(`Got ${type}, required String`);
  }

  // Data passes all tests, return
  return data;

}

export default {
  name: "FastString",
  fn:   fastStrValidator
};
