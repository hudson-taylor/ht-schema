import merge     from "../merge"
import DELETEKEY from "../deleteKey"

function objValidator(args, childValidators, data, key) {

  function validator(k) {
    // Returns a keyname and corresponding validator for a key, or null
    for(let key in childValidators) {
      if(key == k) return [k, childValidators[k]]
      // Handle as attribute names 'foo as bar'
      let bits = key.split(" ")
      if(bits.length == 3 && bits[0] == k && bits[1] == "as") {
        return [ bits[2], childValidators[key] ]
      }
    }
  }

  // Objects default to strict, this means extra attributes not specified in
  // the schema will throw errors.
  args = merge(args, { strict: true })

  let out = {}
  // Handle no object provided if optional is false
  if(!data && !args.opt) throw new Error(`Got ${typeof data}, required Object`)
  if(!data && args.opt) return DELETEKEY

  // Check we actually have an object
  let type = typeof data

  if(type !== "object") {
    throw new Error(`Got ${typeof data}, required Object`)
  }

  let seen = {}
  // Check that all provided data is valid to the schema
  for(let k in data) {
    seen[k] = true
    let v = validator(k)
    // Handle extra attributes that are not in the schema
    if(args.strict && !v) {
      throw new Error(`${k} is not specified in the schema for ${key}`)
    } else if(!args.strict && !v) {
      // Check for a special * validator to apply
      let sv = validator("*")
      if(sv) {
        let keyId = `${key}.${sv[0]}`
        try {
          out[k] = sv[1].parse(data[k], keyId)
        } catch(e) {
          throw new Error(`Failed to parse ${keyId}: ${e.message}`)
        }
      } else {
        out[k] = data[k]; // Otherwise pass them as-is.
      }
      continue
    }
    let keyId = `${key}.${v[0]}`
    try {
      out[v[0]] = v[1].parse(data[k], keyId)
    } catch(e) {
      throw new Error(`Failed to parse ${keyId}: ${e.message}`)
    }
  }

  // Check that all required schema fields have been provided
  for(let k in childValidators) {
    if(k === "*") continue
    // Handle renamed attrs
    let bits = k.split(" ")
    if(bits.length === 3) k = bits[0]
    if(!seen[k]) {
      let v, keyId
      try {
        v = validator(k)
        keyId = `${key}.${v[0]}`
        const defaultValue = typeof v[1].$args.default === 'function' ? v[1].$args.default() : v[1].$args.default
        out[v[0]] = v[1].parse(defaultValue, keyId)
      } catch(e) {
        throw new Error(`Missing attribute '${key}.${v[0]}': ${e.message}`)
      }
    }
  }
  // Delete any keys that have a value of {htDeleteKey:true}
  Object.keys(out).forEach(function(k) {
    if(out[k] !== null && typeof out[k] === "object" && out[k].htDeleteKey) {
      delete out[k]
    }
  })

  return out

}

objValidator.hasChildValidators = 'object'

export default {
  name: "Object",
  fn:   objValidator
}
