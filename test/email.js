
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Email validator", function() {

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

});