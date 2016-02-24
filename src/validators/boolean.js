import DELETEKEY from "../deleteKey";

function boolValidator(args, childValidators, data) {

  if(data === undefined) {
    if(args.opt) {
      return DELETEKEY;
    }
    throw new Error("Got undefined, expected Boolean");
  }

  if(args.coerce) {
    return Boolean(data);
  }

  if(typeof data != "boolean") {
    throw new Error(`Got ${typeof data}, expected Boolean`);
  }

  return data;

}

export default {
  name: "Boolean",
  fn:   boolValidator
};
