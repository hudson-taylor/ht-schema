
"use strict";

const fs   = require("fs");
const path = require("path");

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
                    if(typeof arguments[0][k] == "object" && arguments[0][k].hasOwnProperty("childValidators")) {
                        areValidators = true;
                        break;
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
    this.parserFunc      = parserFunc;
    this.args            = args;
    this.childValidators = childValidators;
    this.docFunc         = docFunc;
}

Parser.prototype.parse = function(data, key, first) {
    //All validators should handle opt (optional)
    let args = merge(this.args, { opt: false });
    let val = this.parserFunc.call(this, args, this.childValidators, data, key);
    if(first && val !== null && typeof val == "object" && val.htDeleteKey) return null;
    return val;
};

Parser.prototype.validate = function(data, key) {
    return this.parse(data, key || "schema", true);
};

Parser.prototype.document = function() {
    return this.docFunc.call(this, this.args);
};

validators.makeParser = makeParser;
module.exports = validators;
