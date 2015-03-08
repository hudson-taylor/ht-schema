
"use strict";

var assert = require("assert");

var s = require("../");

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

});
