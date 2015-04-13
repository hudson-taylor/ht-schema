
"use strict";

const assert = require("assert");
const s      = require("../");

describe("TypedArray validator", function() {

    it("should require value", function() {
        let schema = s.TypedArray([ s.Any() ]);
        assert.throws(function() {
            schema.validate();
        });
    });

    it("should allow optional value if opt is set", function() {

        let schema = s.TypedArray({ opt: true });

        assert.doesNotThrow(function() {
            schema.validate(undefined);
        });

    });

    it("should error if length if data is not correct", function() {

        let schema = s.TypedArray([ s.Number() ]);

        assert.throws(function() {
            schema.validate([ 5, 5 ]);
        }, /Got 2 elements, expected 1/);

    });

    it("should error if types don't match", function() {

        let schema = s.TypedArray([ s.Number(), s.String() ]);

        assert.throws(function() {
            schema.validate([ "hello", 5 ]);
        }, /Error validating element in position 0/);

    });

    it("should return array if elements match", function() {

        let schema = s.TypedArray([ s.Number(), s.String(), s.Number() ]);

        assert.deepEqual(schema.validate([ 42, "hello", 1337 ]), [ 42, "hello", 1337 ]);

    });

});
