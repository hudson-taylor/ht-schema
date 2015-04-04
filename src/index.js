
"use strict";

const fs   = require("fs");
const path = require("path");

const clone = require('clone');

const merge = require("./merge");

let validators = {};

let validatorsPath = path.resolve(__dirname, "../validators");

let files = fs.readdirSync(validatorsPath);

files.forEach(function(file) {
    let t = require(path.join(validatorsPath, file));
    validators[t.name] = makeParser(t.fn);
});

function makeParser(parserFunc, docFunc) {

    // parserFunc takes arguments, child-validators || null, and the data to
    // parse, it should throw an Error if the data is invalid, containing a
    // reason. Otherwise it should return a value. 
    // This value can be mutated, it will be the "validated" value.

    return function validator(args, childValidators) {

        // Overly complex method of managing argument order!
        switch(arguments.length) {

            case 0: {
                childValidators = {};
                args = {};
                break;
            }

            case 1: {

                // One argument, are they args or validators?
                let areValidators = false;

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
                } else {
                    args = arguments[0];
                    childValidators = null;
                }
                break;

            }
            
        }

        var parser = new Parser(parserFunc, args, childValidators, docFunc);

        return parser;

    };
}

function Parser(parserFunc, args, childValidators, docFunc) {

    this.$parserFunc  = parserFunc;
    this.$args        = args;
    this.$validators  = childValidators;
    this.$docFunc     = docFunc;

    var getValidatorFn = function(k) {
        return function() {
            return this.$validators[k];
        }.bind(this);
    }.bind(this);

    this.keys = {};

    if(this.$validators && typeof this.$validators === "object" && !Array.isArray(this.$validators) && Object.keys(this.$validators).length) {
        for(var k in this.$validators) {
            Object.defineProperty(this.keys, k, {
                get: getValidatorFn(k)
            });
        }
    }

}

Parser.prototype.parse = function(data, key, first) {
    //All validators should handle opt (optional)
    let args = merge(this.$args, { opt: false });
    let val = this.$parserFunc.call(this, args, this.$validators, data, key);
    if(first && val !== null && typeof val == "object" && val.htDeleteKey) return null;
    return val;
};

Parser.prototype.validate = function(data, key) {
    return this.parse(data, key || "schema", true);
};

Parser.prototype.document = function() {
    return this.$docFunc.call(this, this.$args);
};

Parser.prototype.clone = function(...params) {

    let parserFunc      = clone(this.$parserFunc);
    let args            = clone(this.$args);
    let childValidators = clone(this.$validators);
    let docFunc         = clone(this.$docFunc);

    params.forEach(function(arg) {
        if(arg && typeof childValidators === 'object') {
            if(Array.isArray(arg)) {
                // If arg is an array, it's a whitelist
                for(var k in childValidators) {
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

    return new Parser(parserFunc, args, childValidators, docFunc);

};

validators.makeParser = makeParser;
module.exports = validators;
