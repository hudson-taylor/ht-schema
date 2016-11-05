import isemail from "isemail"

function fastEmailValidator(args, childValidators, data) {

  let type = typeof data

  if(type !== "string") {
    throw new Error(`Got ${type}, required Email (string)`)
  }

  data = data.trim().toLowerCase()

  if(!isemail.validate(data)) {
    throw new Error("Invalid Email: " + data)
  }

  return data

}

export default {
  name: "FastEmail",
  fn:   fastEmailValidator
}
