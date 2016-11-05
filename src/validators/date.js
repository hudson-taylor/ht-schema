import merge     from "../merge"
import DELETEKEY from "../deleteKey"

function dateValidator(args, childValidators, data) {

  args = merge(args, { min: null, max: null, parse: false })

  if(data === undefined) {
    if(args.opt) {
      return DELETEKEY
    }
    throw new Error(`Got undefined, required Date`)
  }

  if(Object.prototype.toString.call(data) !== '[object Date]' && args.parse !== true) {
    throw new Error(`Got ${typeof data}, required Date`)
  }

  let d = new Date(data)

  if(isNaN(d.getTime())) {
    throw new Error(`Got ${typeof data}, required Date or Date compatible string`)
  }

  if(args.min && d.getTime() < new Date(args.min).getTime()) {
    throw new Error(`Got date ${data}, expected greater than ${args.min}`)
  }

  if(args.max && d.getTime() > new Date(args.max).getTime()) {
    throw new Error(`Got date ${data}, expected less than ${args.max}`)
  }

  return d

}

export default {
  name: "Date",
  fn:   dateValidator
}
