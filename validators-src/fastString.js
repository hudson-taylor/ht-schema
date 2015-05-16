
"use strict";

function fastStrValidator(args, childValidators, data) {

  // If we have no data, and this value is not optional, throw
  if(!data && data !== "") {
    throw new Error("required String");
  }

  // Basic typechecking
  let type = typeof data;

  if(type !== "string") {
    throw new Error("required String, got " + type + ", expected " + data);
  }

  // Data passes all tests, return
  return data;

}

export default {
  name: "FastString",
  fn:   fastStrValidator
};
