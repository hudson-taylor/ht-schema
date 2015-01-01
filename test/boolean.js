
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Boolean validator", function() {

    it("should accept a valid Bool", function() {
        var schema = s.Boolean();
        assert.equal(schema.validate(true), true);
    });
    
});