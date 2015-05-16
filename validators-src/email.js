
"use strict";

const isemail = require("isemail");

const merge     = require("../lib/merge");
const DELETEKEY = require("../lib/deleteKey");

function emailValidator(args, childValidators, data) {
  args = merge(args, { normalize: true });

  if(data === undefined) {
    if(args.opt) {
        return DELETEKEY;
    }
    throw new Error("required Email address");
  }

  let type = typeof data;

  if(type !== "string") {
    throw new Error("required String Email: got " + type);
  }

  data = data.trim();

  if(args.normalize) {
    data = data.toLowerCase();
  }

  if(!isemail(data)) {
    throw new Error("Invalid Email: " + data);
  }

  return data;

}

export default {
  name: "Email",
  fn:   emailValidator
};
