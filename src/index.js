
"use strict";

const fs   = require("fs");
const path = require("path");
const util = require("util");

const clone = require("clone");

const merge = require("./merge");

const validatorsPath = path.resolve(__dirname, "../validators");

const files = fs.readdirSync(validatorsPath);

let validators = {};

files.forEach(function(file) {
  const t = require(path.join(validatorsPath, file));
  validators[t.name] = makeValidator(t.name, t.fn);
});

function makeValidator(validatorName, validatorFunc) {

  // validatorFunc takes arguments, child-validators || null, and the data to
  // parse, it should throw an Error if the data is invalid, containing a
  // reason. Otherwise it should return a value.
  // This value can be mutated, it will be the "validated" value.

  return function validator(args = {}, childValidators = {}, areValidators) {

    if(validatorFunc.hasChildValidators) {

      // Overly complex method of managing argument order!
      if(arguments.length === 1 && !areValidators) {

        // One argument, are they args or validators?
        for(let k in arguments[0]) {
          let arg = arguments[0][k];
          if(typeof arg == "object" && Object.prototype.toString.call(arg) === "[object Object]") {
            // TODO: if any args have a value that
            // is an object, they will be parsed
            // as validators... not good.
            // HACK: Explicitly allow 'default' to be an object.
            if(k == 'default') {
              continue;
            }
            if(!arg.hasOwnProperty("$validators")) {
              arguments[0][k] = validators.Object(arg);
            }
            areValidators = true;
          }
        }

        if(areValidators) {
          childValidators = arguments[0];
          args = {};
        }

      }

    }

    if(!Object.keys(args).length) {

      // If we have no custom arguments
      // try to load the fast version
      // of the validator.
      const fastValidatorName = "Fast" + validatorName;
      const fastValidatorFunc = validators[fastValidatorName];

      if(fastValidatorFunc) {
        return fastValidatorFunc(args, childValidators, areValidators);
      }

    }

    return new Validator(validatorName, validatorFunc, args, childValidators);

  };
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

Validator.prototype.validate = function(data, key) {
    return this.parse(data, key || "schema", true);
};

Validator.prototype.document = function() {
  let obj = {
    name: this.$name,
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
module.exports = validators;
