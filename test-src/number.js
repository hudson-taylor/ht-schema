
"use strict";

const assert = require("assert");
const s      = require("../");

describe("Number validator", function() {
    let small        = 2;
    let large        = 900000000001;
    let stringNumber = "123";
    let notANumber   = {};

    it("should require value", function() {
        let schema = s.Number({ opt: false });
        assert.throws(function() {
            schema.validate();
        });
    });

    it("should allow optional value if opt is set", function() {
        let schema = s.Number({ opt: true });
        assert.doesNotThrow(function() {
            schema.validate();
        });
    });

    it("should accept a valid Number", function() {
        let schema = s.Number({ opt: false });
        assert.equal(schema.validate(small), small);
    });

    it("should reject an invalid Number", function() {
        let schema = s.Number({ opt: false });
        assert.throws(function() {
            schema.validate(notANumber);
        }, Error);
    });

    it("should accept a valid Number as a string", function() {
        let schema = s.Number({ opt: false });
        assert.equal(schema.validate(stringNumber), 123);
    });

    it("should reject a number less than min", function() {
        let schema = s.Number({ min: 5 });
        assert.throws(function() {
            schema.validate(small);
        }, Error);
    });

    it("should reject a number greater than max", function() {
        let schema = s.Number({ max: 3 });
        assert.throws(function() {
            schema.validate(large);
        }, Error);
    });
});
