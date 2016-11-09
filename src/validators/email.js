import isemail from "isemail"

import merge     from "../merge"
import DELETEKEY from "../deleteKey"

function emailValidator(args, childValidators, data) {
  args = merge(args, { normalize: true })

  if(data === undefined) {
    if(args.opt) {
        return DELETEKEY
    }
    throw new Error("Got undefined, required Email (string)")
  }

  let type = typeof data

  if(type !== "string") {
    throw new Error(`Got ${type}, required Email (string)`)
  }

  data = data.trim()

  if(args.normalize) {
    data = data.toLowerCase()
  }

  if(!isemail(data)) {
    throw new Error("Invalid Email: " + data)
  }

  return data

}

export default {
  name: "Email",
  fn:   emailValidator
}
