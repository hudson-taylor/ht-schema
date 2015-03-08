
"use strict";

import assert from "assert";
import s      from "../";

describe("Boolean validator", function() {

    it("should require value", function() {

        let schema = s.Boolean();

        assert.throws(function() {
            schema.validate();
        });

    });

    it("should allow optional value if opt is set", function() {

        let schema = s.Boolean({ opt: true });

        assert.doesNotThrow(function() {
            schema.validate(undefined);
        });

    });

    it("should coerce given value if coerce is set", function() {

        let schema = s.Boolean({ coerce: true });

        let result = schema.validate("hello");

        assert.equal(result, true);

    });

    it("should throw if value given is not boolean", function() {

        let schema = s.Boolean();

        assert.throws(function() {
            schema.validate(42);
        });

    });

    it("should validate correctly", function() {

        let schema = s.Boolean();

        assert.doesNotThrow(function() {

            schema.validate(true);
            schema.validate(false);

        });

    });

});
