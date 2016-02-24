function fastNumberValidator(args, childValidators, data) {

  let d = Number(data);

  if(isNaN(d)) {
    throw new Error(`Got ${typeof data}, required Number`);
  }

  return d;

}

export default {
  name: "FastNumber",
  fn:   fastNumberValidator
};
