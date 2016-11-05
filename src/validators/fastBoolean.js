function fastBoolValidator(args, childValidators, data) {

  let type = typeof data

  if(type != "boolean") {
    throw new Error(`Got ${type}, required Boolean`)
  }

  return data

}

export default {
  name: "FastBoolean",
  fn:   fastBoolValidator
}
