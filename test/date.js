
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Date validator", function() {
    var old       = new Date("1979");
    var oldString = "1979";
    var older     = new Date("1970");
    var now       = new Date();
    var notADate  = { dinosaur: "rawwwr" };

    it("should require value", function() {

        var schema = s.Date();

        assert.throws(function() {
            schema.validate();
        });

    });
    
    it("should allow optional value if opt is set", function() {

        var schema = s.Date({ opt: true });

        assert.doesNotThrow(function() {
            schema.validate(undefined);
        });

    });

    it("should accept a valid Date", function() {
        var schema = s.Date();
        assert.equal(schema.validate(old).getTime(), old.getTime());
    });

    it("should reject an invalid Date", function() {
        var schema = s.Date();
        assert.throws(function() {
            schema.validate(notADate);
        }, Error);
    });

    it("should accept a valid Date as a string", function() {
        var schema = s.Date();
        assert.equal(schema.validate(oldString).getTime(), old.getTime());
    });

    it("should reject a Date less than min", function() {
        var schema = s.Date({min: old});
        assert.throws(function() {
            schema.validate(older);
        }, Error);
    });

    it("should reject a Date greater than max", function() {
        var schema = s.Date({max: old});
        assert.throws(function() {
            schema.validate(now);
        }, Error);
    });
});