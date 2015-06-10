
"use strict";

const merge     = require("../lib/merge");
const DELETEKEY = require("../lib/deleteKey");

function dateValidator(args, childValidators, data) {

  args = merge(args, { min: null, max: null, parse: false });

  if(data === undefined) {
    if(args.opt) {
      return DELETEKEY;
    }
    throw new Error("required Date");
  }

  if(Object.prototype.toString.call(data) !== '[object Date]' && args.parse !== true) {
    throw new Error("required date, received (" + typeof data + ") " + data.toString());
  }

  let d = new Date(data);

  if(isNaN(d.getTime())) {
    throw new Error("required date or Date compatible string, received (" + typeof data + ") " + data.toString());
  }

  if(args.min && d.getTime() < new Date(args.min).getTime()) {
    throw new Error("must be greater than "+new Date(args.min));
  }

  if(args.max && d.getTime() > new Date(args.max).getTime()) {
    throw new Error("must be less than or equal to "+new Date(args.max));
  }

  return d;

}

export default {
  name: "Date",
  fn:   dateValidator
};
