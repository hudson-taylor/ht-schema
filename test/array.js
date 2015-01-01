
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Array validator", function() {

    var numArray   = [ 1, 2, 3 ];
    var mixedArray = [ 1, 2, 3, "bananna" ];
    var messyArray = [ 1, 2, 3, "bananna", { name: "cat", colour: "brown" } ];

    it("should accept a valid simple Array", function() {
        var schema = s.Array([s.Number()]);
        assert.deepEqual(schema.validate(numArray), numArray);
    });

    it("should reject an invalid simple Array", function() {
        var schema = s.Array([s.Number()]);
        assert.throws(function() {
            schema.validate(mixedArray);
        }, Error);
    });

    it("should accept a valid simple mixed Array", function() {
        var schema = s.Array([ s.Number(), s.String() ]);
        assert.deepEqual(schema.validate(mixedArray), mixedArray);
    });

    it("should accept a valid complex mixed Array", function() {
        var schema = s.Array([
            s.Number(),
            s.String(),
            s.Object({
                name:  s.String(),
                colour: s.String()
            })
        ]);
        assert.deepEqual(schema.validate(messyArray), messyArray);
    });

});
