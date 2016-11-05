import merge     from "../merge"
import DELETEKEY from "../deleteKey"

function numValidator(args, childValidators, data) {
  args = merge(args, { min: null, max: null })

  if(data === undefined) {
    if(args.opt) {
      return DELETEKEY
    }
    throw new Error(`Got undefined, required Number`)
  }

  let origType = typeof data
  data = Number(data)

  if(isNaN(data)) throw new Error(`Got ${origType}, expected Number`)

  if(args.min && data < args.min) {
    throw new Error(`Got ${data}, expected more than ${args.min}`)
  }

  if(args.max && data > args.max) {
    throw new Error(`Got ${data}, expected less than ${args.max}`)
  }

  return data
}

export default {
  name: "Number",
  fn:   numValidator
}
