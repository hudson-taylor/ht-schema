
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Number validator", function() {
    var small        = 2;
    var large        = 900000000001;
    var stringNumber = "123";
    var notANumber   = {};

    it("should require value", function() {
        var schema = s.Number();
        assert.throws(function() {
            schema.validate();
        });
    });

    it("should allow optional value if opt is set", function() {
        var schema = s.Number({ opt: true });
        assert.doesNotThrow(function() {
            schema.validate();
        });
    });

    it("should accept a valid Number", function() {
        var schema = s.Number();
        assert.equal(schema.validate(small), small);
    });

    it("should reject an invalid Number", function() {
        var schema = s.Number();
        assert.throws(function() {
            schema.validate(notANumber);
        }, Error);
    });

    it("should accept a valid Number as a string", function() {
        var schema = s.Number();
        assert.equal(schema.validate(stringNumber), 123);
    });

    it("should reject a number less than min", function() {
        var schema = s.Number({ min: 5 });
        assert.throws(function() {
            schema.validate(small);
        }, Error);
    });

    it("should reject a number greater than max", function() {
        var schema = s.Number({ max: 3 });
        assert.throws(function() {
            schema.validate(large);
        }, Error);
    });
});
