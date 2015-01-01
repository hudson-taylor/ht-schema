
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Any validator", function() {

    it("should allow any value", function() {
        var schema = s.Array([ s.Any() ]);
        schema.validate([ true, 5, "hello" ]);
    });

});