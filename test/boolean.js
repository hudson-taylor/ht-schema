
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Boolean validator", function() {

    it("should allow optional value", function() {
        var schema = s.Boolean({ opt: true });
        assert.doesNotThrow(function() {
          schema.validate();
        });
    });

    it("should accept a valid Bool", function() {
        var schema = s.Boolean();
        assert.equal(schema.validate(true), true);
    });

    it("should reject non-boolean", function() {
        var schema = s.Boolean();
        [ 42, "hello", /world/ ].forEach(function(s) {
          assert.throws(function() {
            schema.validate(s);
          });
        });
    });

    it("should coerce values with option set", function() {
        var schema = s.Boolean({ coerce: true });
        assert.equal(schema.validate("hello"), true);
        assert.equal(schema.validate(""), false);
    });
    
});