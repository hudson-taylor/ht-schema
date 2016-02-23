
"use strict";

const fs   = require("fs");
const path = require("path");
const util = require("util");

const clone = require("clone");

const merge = require("./merge");

// Manually list files here
// so ht-schema works with browserify.
const files = [
  require('./validators/any'),
  require('./validators/array'),
  require('./validators/boolean'),
  require('./validators/date'),
  require('./validators/email'),
  require('./validators/fastBoolean'),
  require('./validators/fastDate'),
  require('./validators/fastEmail'),
  require('./validators/fastNumber'),
  require('./validators/fastString'),
  require('./validators/number'),
  require('./validators/object'),
  require('./validators/string'),
  require('./validators/typedArray')
];

let validators = {};

files.forEach(function(file) {
  validators[file.name] = makeValidator(file.name, file.fn);
});

function makeValidator(validatorName, validatorFunc) {

  // validatorFunc takes arguments, child-validators || null, and the data to
  // parse, it should throw an Error if the data is invalid, containing a
  // reason. Otherwise it should return a value.
  // This value can be mutated, it will be the "validated" value.

  return function validator(...args) {

    let opts = {}, childValidators = {};

    for(let i = 0; i < args.length; i++) {

      let arg = args[i];

      if((validatorFunc.hasChildValidators == 'array' && Array.isArray(arg)) || (typeof arg === validatorFunc.hasChildValidators)) {

        if(Object.keys(arg).every(function(k) {
          let t = arg[k];
          let _v = t ? validators[t.name] : null;
          if(_v) {
            let v = _v();
            t = v;
            arg[k] = v;
            return true;
          }
          return t.hasOwnProperty('$validators');
        })) {
          childValidators = arg;
          continue;
        }

      }

      opts = arg;

    }

    if(!Object.keys(opts).length) {

      // If we have no custom arguments
      // try to load the fast version
      // of the validator.
      const fastValidatorName = "Fast" + validatorName;
      const fastValidatorFunc = validators[fastValidatorName];

      if(fastValidatorFunc) {
        return fastValidatorFunc(opts, childValidators);
      }

    }

    return new Validator(validatorName, validatorFunc, opts, childValidators);

  };
}

function generateValidator(json) {

  let { name, args = {}, children } = json;

  let type = validators[name];

  if(!type) {
    throw new Error("Unknown validator type: " + name);
  }

  let params = [ args ];

  if(Array.isArray(children)) {
    params.push(children.map(function(child) {
      return generateValidator(child);
    }));
  } else if(typeof children === 'object') {
    for(let k in children) {
      children[k] = generateValidator(children[k]);
    }
    params.push(children);
  }

  let validator = type(...params);

  return validator;

}

function Validator(name, validatorFunc, args, childValidators) {

  this.$name          = name;
  this.$validatorFunc = validatorFunc;
  this.$args          = args;
  this.$validators    = childValidators;

  const getValidatorFn = function(k) {
    return function() {
      return this.$validators[k];
    }.bind(this);
  }.bind(this);

  this.keys = {};

  if(this.$validators && typeof this.$validators === "object" && !Array.isArray(this.$validators) && Object.keys(this.$validators).length) {
    for(let k in this.$validators) {
      Object.defineProperty(this.keys, k, {
        get: getValidatorFn(k)
      });
    }
  }

}

Validator.prototype.parse = function(data, key, first) {
  //All validators should handle opt (optional)
  const args = merge(this.$args, { opt: false });
  const val = this.$validatorFunc(args, this.$validators, data, key);
  if(first && val !== null && typeof val == "object" && val.htDeleteKey) return null;
  return val;
};

Validator.prototype.validate = function(data, key, callback) {
  if(typeof key === 'function') {
    callback = key;
    key = undefined;
  }
  function fin(err, res) {
    if(callback) {
      return setImmediate(() => callback(err, res));
    } else {
      if(err) {
        throw err;
      } else {
        return res;
      }
    }
  }
  let val;
  try {
    val = this.parse(data, key || "schema", true);
  } catch(e) {
    return fin(e);
  }
  return fin(null, val);
};

Validator.prototype.document = function() {
  // generate function will automatically make them
  // fast again if need be.
  let name = this.$name.replace(/^Fast/, '');
  let obj = {
    name,
    args: this.$args
  }
  let children = {};
  for(let k in this.$validators) {
    children[k] = this.$validators[k].document();
  }

  if(this.$validatorFunc.hasChildValidators === "array") {
    obj.children = Object.keys(children).map((k) => children[k]);
  } else if(Object.keys(children).length) {
    obj.children = children;
  }
  if(this.$comment) {
    obj.comment = typeof this.$comment === 'function' ? this.$comment(obj) : this.$comment;
  }
  return obj;
};

Validator.prototype.clone = function(...params) {

  let validatorFunc   = clone(this.$validatorFunc);
  let args            = clone(this.$args);
  let childValidators = clone(this.$validators);

  params.forEach(function(arg) {
    if(arg && typeof childValidators === 'object') {
      if(Array.isArray(arg)) {
        // If arg is an array, it's a whitelist
        for(let k in childValidators) {
          if(!~arg.indexOf(k)) {
            delete childValidators[k];
          }
        }
      } else if(typeof arg === 'object') {
        // If arg is an object, it's probably new "args"
        args = merge(arg, args);
      }
    }
  });

  return new Validator(this.$name, validatorFunc, args, childValidators);

};

Validator.prototype.comment = function(comment) {
  this.$comment = comment;
  return this;
}

validators.makeValidator = makeValidator;
validators.generate = generateValidator;
module.exports = validators;
