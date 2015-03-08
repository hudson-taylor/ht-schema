
"use strict";

import assert from "assert";
import s      from "../";

describe("Array validator", function() {

    let numArray   = [ 1, 2, 3 ];
    let mixedArray = [ 1, 2, 3, "bananna" ];
    let messyArray = [ 1, 2, 3, "bananna", { name: "cat", colour: "brown" } ];

    it("should require value", function() {
        let schema = s.Array([ s.Any() ]);
        assert.throws(function() {
            schema.validate();
        });
    });

    it("should allow optional value if opt is set", function() {

        let schema = s.Array({ opt: true });

        assert.doesNotThrow(function() {
            schema.validate(undefined);
        });

    });

    it("should accept a valid simple Array", function() {
        let schema = s.Array([s.Number()]);
        assert.deepEqual(schema.validate(numArray), numArray);
    });

    it("should reject an invalid simple Array", function() {
        let schema = s.Array([s.Number()]);
        assert.throws(function() {
            schema.validate(mixedArray);
        }, Error);
    });

    it("should accept a valid simple mixed Array", function() {
        let schema = s.Array([ s.Number(), s.String() ]);
        assert.deepEqual(schema.validate(mixedArray), mixedArray);
    });

    it("should accept a valid complex mixed Array", function() {
        let schema = s.Array([
            s.Number(),
            s.String(),
            s.Object({
                name:  s.String(),
                colour: s.String()
            })
        ]);
        assert.deepEqual(schema.validate(messyArray), messyArray);
    });

    it("should accept length option", function() {

        let schema = s.Array({ length: 5 }, [ s.Number() ]);

        assert.throws(function() {
            schema.validate([ 1, 2, 3, 4 ]);
        });

        assert.deepEqual(schema.validate([ 1, 2, 3, 4, 5 ]), [ 1, 2, 3, 4, 5 ]);

    });

    it("should accept minLength option", function() {

        let schema = s.Array({ minLength: 3 }, [ s.Number() ]);

        assert.throws(function() {
            schema.validate([ 1, 2 ]);
        });

        assert.deepEqual(schema.validate([ 1, 2, 3 ]), [ 1, 2, 3 ]);
        assert.deepEqual(schema.validate([ 1, 2, 3, 4, 5, 6, 7 ]), [ 1, 2, 3, 4, 5, 6, 7 ]);

    });

    it("should accept maxLength option", function() {

        let schema = s.Array({ maxLength: 3 }, [ s.Number() ]);

        assert.throws(function() {
            schema.validate([ 1, 2, 3, 4 ]);
        });

        assert.deepEqual(schema.validate([ 1 ]), [ 1 ]);
        assert.deepEqual(schema.validate([ 1, 2, 3 ]), [ 1, 2, 3 ]);

    });

});
