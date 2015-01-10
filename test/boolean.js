
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Boolean validator", function() {

    it("should require value", function() {

        var schema = s.Boolean();

        assert.throws(function() {
            schema.validate();
        });

    });
    
    it("should allow optional value if opt is set", function() {

        var schema = s.Boolean({ opt: true });

        assert.doesNotThrow(function() {
            schema.validate(undefined);
        });

    });

    it("should coerce given value if coerce is set", function() {

        var schema = s.Boolean({ coerce: true });

        var result = schema.validate("hello");

        assert.equal(result, true);

    });

    it("should throw if value given is not boolean", function() {

        var schema = s.Boolean();

        assert.throws(function() {
            schema.validate(42);
        });

    });

    it("should validate correctly", function() {

        var schema = s.Boolean();

        assert.doesNotThrow(function() {

            schema.validate(true);
            schema.validate(false);

        });

    });

    // it("should allow optional value", function() {
    //     var schema = s.Boolean({ opt: true });
    //     assert.doesNotThrow(function() {
    //       schema.validate();
    //     });
    // });

    // it("should accept a valid Bool", function() {
    //     var schema = s.Boolean();
    //     assert.equal(schema.validate(true), true);
    // });

    // it("should reject non-boolean", function() {
    //     var schema = s.Boolean();
    //     [ 42, "hello", /world/ ].forEach(function(s) {
    //       assert.throws(function() {
    //         schema.validate(s);
    //       });
    //     });
    // });

    // it("should coerce values with option set", function() {
    //     var schema = s.Boolean({ coerce: true });
    //     assert.equal(schema.validate("hello"), true);
    //     assert.equal(schema.validate(""), false);
    // });
    
});