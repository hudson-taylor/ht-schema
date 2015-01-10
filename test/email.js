
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Email validator", function() {

    it("should require value", function() {

        var schema = s.Email();

        assert.throws(function() {
            schema.validate();
        });

    });
    
    it("should allow optional value if opt is set", function() {

        var schema = s.Email({ opt: true });

        assert.doesNotThrow(function() {
            schema.validate(undefined);
        });

    });

    it("should require string", function() {

        var schema = s.Email();

        assert.throws(function() {
            schema.validate(true);
        });

    });

    it("should accept valid email addresses", function() {
        var schema = s.Email();
        var valid = [
            "mel@example.com",
            "mel+chickensGoBrrrk@example.com",
            "root@127.0.0.1"
        ];
        var invalid = [
            "notanemailaddress",
            "this has spaces @ foo"
        ];
        valid.forEach(function(e) {
            assert.equal(schema.validate(e), e.toLowerCase());
        });
        invalid.forEach(function(e) {
            assert.throws(function() {
                schema.validate(e);
            }, Error);
        });
    });

    it("should normalize email if option is set", function() {

        var schema = s.Email({ normalize: true });

        var email = "TesT@heLLo.CoM";

        var result = schema.validate(email);

        assert.equal(result, email.toLowerCase());

    });

});