
"use strict";

const merge     = require("../lib/merge");
const DELETEKEY = require("../lib/deleteKey");

function objParser(args, childValidators, data, key) {
    childValidators = childValidators || {};
    function validator(k) {
        //returns a keyname and corresponding validator for a key, or null
        for(let key in childValidators) {
            if(key == k) return [k, childValidators[k]];
            //handle as attribute names 'foo as bar'
            let bits = key.split(" ");
            if(bits.length == 3 && bits[0] == k && bits[1] == "as") {
                return [bits[2], childValidators[key]];
            }
        }
    }

    //objects default to strict, this means extra attributes not specified in
    //the schema will throw errors.
    args = merge(args, { strict : true });

    let out = {};
    //handle no object provided if optional is false
    if(!data && !args.opt) throw new Error("required Object");
    if(!data && args.opt) return DELETEKEY;

    //check we actually have an object
    let type = typeof data;

    if(type !== "object") {
        throw new Error("must be an object, received "+ type);
    }

    let seen = {};
    // Check that all provided data is valid to the schema
    for(let k in data) {
        seen[k] = true;
        let v = validator(k);
        //Handle extra attributes that are not in the schema
        if(args.strict && !v) {
            throw new Error(k+ " is not specified in " + key);
        } else if(!args.strict && !v) {
            //check for a special * validator to apply
            let sv = validator("*");
            if(sv) {
                try {
                    out[k] = sv[1].parse(data[k], key + "." + sv[0]);
                } catch(e) {
                    throw new Error("Failed to parse " + key + "." + sv[0] + ": " + e.message);
                }
            } else {
                out[k] = data[k]; //otherwise pass them as-is.
            }
            continue;
        } else if(!data[k] && v[1].args.default) {
            data[k] = v[1].args.default;
        }
        try {
            out[v[0]] = v[1].parse(data[k], key + "." + v[0]);
        } catch(e) {
            throw new Error("Failed to parse " + key + "." + v[0] + ": " + e.message);
        }
    }

    // Check that all required schema fields have been provided
    for(let k in childValidators) {
        if(k == "*") continue;
        //handle renamed attrs
        let bits = k.split(" ");
        if(bits.length == 3) k = bits[0];
        if(!seen[k]) {
            try {
                let v = validator(k);
                out[v[0]] = v[1].parse(null || v[1].args.default, key + "." + v[0]);
            } catch(e) {
                throw new Error("Missing attribute '" + key + "." + v[0] + "': " + e.message);
            }
        }
    }
    //Delete any keys that have a value of {htDeleteKey:true}
    Object.keys(out).forEach(function(k) {
        if(out[k] !== null && typeof out[k] == "object" && out[k].htDeleteKey) {
            delete out[k];
        }
    });

    return out;

}

export default {
    name: "Object",
    fn:   objParser
};