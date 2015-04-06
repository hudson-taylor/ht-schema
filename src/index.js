
"use strict";

const fs   = require("fs");
const path = require("path");

const clone = require("clone");

const merge = require("./merge");

const validatorsPath = path.resolve(__dirname, "../validators");

const files = fs.readdirSync(validatorsPath);

let validators = {};

files.forEach(function(file) {
    const t = require(path.join(validatorsPath, file));
    validators[t.name] = makeParser(t.name, t.fn);
});

function makeParser(parserName, parserFunc) {

    // parserFunc takes arguments, child-validators || null, and the data to
    // parse, it should throw an Error if the data is invalid, containing a
    // reason. Otherwise it should return a value. 
    // This value can be mutated, it will be the "validated" value.

    return function validator(args = {}, childValidators = {}, areValidators) {

        if(parserFunc.hasChildValidators === true) {

          // Overly complex method of managing argument order!
          if(arguments.length === 1 && !areValidators) {

              // One argument, are they args or validators?
              for(let k in arguments[0]) {
                  let arg = arguments[0][k];
                  if(typeof arg == "object" && Object.prototype.toString.call(arg) === "[object Object]") {
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
            const fastParserName = "Fast" + parserName;
            const fastParserFunc = validators[fastParserName];

            if(fastParserFunc) {
                return fastParserFunc(args, childValidators, areValidators);
            }

        }

        const parser = new Parser(parserName, parserFunc, args, childValidators);

        return parser;

    };
}

function Parser(name, parserFunc, args, childValidators) {

    this.$name        = name;
    this.$parserFunc  = parserFunc;
    this.$args        = args;
    this.$validators  = childValidators;

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

Parser.prototype.parse = function(data, key, first) {
    //All validators should handle opt (optional)
    const args = merge(this.$args, { opt: false });
    const val = this.$parserFunc(args, this.$validators, data, key);
    if(first && val !== null && typeof val == "object" && val.htDeleteKey) return null;
    return val;
};

Parser.prototype.validate = function(data, key) {
    return this.parse(data, key || "schema", true);
};

Parser.prototype.document = function() {
  let obj = {
    name: this.$name,
    args: this.$args
  }
  let children = {};
  for(let k in this.$validators) {
    children[k] = this.$validators[k].document();
  }
  if(this.$name === "Array") {
    obj.children = Object.keys(children).map((k) => children[k]);
  } else if(Object.keys(children).length) {
    obj.children = children;
  }
  return obj;
};

Parser.prototype.clone = function(...params) {

    let parserFunc      = clone(this.$parserFunc);
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

    return new Parser(this.$name, parserFunc, args, childValidators);

};

validators.makeParser = makeParser;
module.exports = validators;
