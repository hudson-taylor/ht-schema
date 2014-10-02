
"use strict";

var fs = require("fs");

var merge = require("./lib/merge");

var validators = {};

var files = fs.readdirSync("./validators");

files.forEach(function(file) {
    var t = require("./validators/" + file);
    validators[t.name] = makeParser(t.fn);
});

validators.makeParser = makeParser;

module.exports = validators;

function makeParser(parserFunc, docFunc) {
    //parserFunc takes arguments, child-validators || null, and the data to
    //parse, it should throw an Error if the data is invalid, containing a
    //reason. Otherwise it should return a value. This value can be mutated,
    //it will be the "validated" value.

    return function validator(args, childValidators) {
        //overly complex method of managing argument order!
        switch(arguments.length) {
            case 0:
                childValidators = {};
                args = {};
                break;
            case 1:
                //one argument, arge they args or validators?
                var areValidators = false;
                if(Array.isArray(arguments[0])) {
                    for(var i=0; i<arguments[0].length; i++) {
                         if(typeof arguments[0][i] == "object" &&
                                arguments[0][i].hasOwnProperty("childValidators")){
                                    areValidators = true;
                                    break;
                                }
                    }
                } else {
                    for(var k in arguments[0]) {
                        if(typeof arguments[0][k] == "object" &&
                                arguments[0][k].hasOwnProperty("childValidators")){
                                    areValidators = true;
                                    break;
                                }
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

        return new (function(args, childValidators) {

            var self = this;
            self.childValidators = childValidators;
            self.args = args;


            self.parse = function(data, key, first) {
                //All validators should handle opt (optional)
                var args = merge(self.args, {opt : false});
                var val = parserFunc.call(self, args, self.childValidators, data, key);
                if(first && val !== null && typeof val == "object" && val.htDeleteKey) return null;
                return val;
            };

            self.validate = function(data, key) {
                return self.parse(data, key || "schema", true);
            };

            self.document = function() {
                return docFunc.call(self, args);
            };
        })(args, childValidators);

    };
}
