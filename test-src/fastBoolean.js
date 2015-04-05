
"use strict";

const assert = require("assert");
const s      = require("../");

describe("FastBoolean validator", function() {

    it("should require value", function() {

        let schema = s.FastBoolean();

        assert.throws(function() {
            schema.validate();
        });

    });

    it("should validate correctly", function() {

        let schema = s.FastBoolean();

        assert.doesNotThrow(function() {

            schema.validate(true);
            schema.validate(false);

        });

    });

});
