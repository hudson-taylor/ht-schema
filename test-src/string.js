
"use strict";

import assert from "assert";

import s from "../";

describe("String validator", function() {
    let shortString = "Hi!";
    let longString  = "I am the very model of a modern major general";
    let notAString  = {};

    it("should accept a valid string", function() {
        let schema = s.String();
        assert.equal(schema.validate(shortString), shortString);
    });

    it("should reject an invalid string", function() {
        let schema = s.String();
        assert.throws(function() {
            schema.validate(notAString);
        }, Error);
    });

    it("should reject a string not matching required length", function() {
        let schema = s.String({ len: 10 });
        assert.throws(function() {
            schema.validate("a");
        });
        schema.validate("123456789a");
    });

    it("should reject a string shorter than min", function() {
        let schema = s.String({ min: 5 });
        assert.throws(function() {
            schema.validate(shortString);
        }, Error);
    });

    it("should reject a string greater than max", function() {
        let schema = s.String({ max: 3 });
        assert.throws(function() {
            schema.validate(longString);
        }, Error);
    });

    it("should accept a valid enum", function() {
        let schema = s.String({
            enum: [ "blue", "green", "red" ]
        });
        assert.equal(schema.validate("blue"), "blue");
    });

    it("should reject an invalid enum", function() {
        let schema = s.String({
            enum: [ "blue", "green", "red" ]
        });
        assert.throws(function() {
            schema.validate("orange");
        }, Error);
    });

    it("should match a regex passed in as string", function() {
        let schema = s.String({
            regex: "^[a-f0-9]+$"
        });
        assert.throws(function() {
            schema.validate("hello world");
        });
        schema.validate("abcdef");
    });

    it("should throw if regex is invalid", function() {
        let schema = s.String({
            regex: "+"
        });
        assert.throws(function() {
            schema.validate("string");
        });
    });

    it("should match a regex", function() {
        let schema = s.String({
            regex: /h.+d/
        });
        assert.throws(function() {
            schema.validate("something");
        });
        schema.validate("hello world");
    });

    it("should trim a string", function() {
        let schema = s.String({
            trim: true
        });
        let str = " hello world ";
        assert.equal(str.trim(), schema.validate(str));
    });

    it("should uppercase string", function() {
        let schema = s.String({
            upper: true
        });
        let str = "hello world";
        assert.equal(str.toUpperCase(), schema.validate(str));
    });

    it("should lowercase string", function() {
        let schema = s.String({
            lower: true
        });
        let str = "HELLO WORLD";
        assert.equal(str.toLowerCase(), schema.validate(str));
    });

    it("should throw if both upper and lower are enabled", function() {
        let schema = s.String({
            upper: true,
            lower: true
        });
        assert.throws(function() {
            schema.validate("");
        });
    });

    it("should take order of precedence into account", function() {
        // trim -> upper/lower -> regex -> enum
        let schema = s.String({
            trim: true,
            upper: true,
            regex: /H.+D/,
            enum: [ "HELLO WORLD" ]
        });
        assert.throws(function() {
            schema.validate("computer says no");
        });
        schema.validate(" hello world  ");
    });

    it("should sanatize string if enabled", function() {
        let schema = s.String({
            sanitize: true
        });
        assert.equal(schema.validate("hello"), "hello");
        assert.equal(schema.validate("<>"), "&lt;&gt;");
    });

});