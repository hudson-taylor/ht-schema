
"use strict";

import assert from "assert";
import s      from "../";

describe("Date validator", function() {
    let old       = new Date("1979");
    let oldString = "1979";
    let older     = new Date("1970");
    let now       = new Date();
    let notADate  = { dinosaur: "rawwwr" };

    it("should require value", function() {

        let schema = s.Date();

        assert.throws(function() {
            schema.validate();
        });

    });
    
    it("should allow optional value if opt is set", function() {

        let schema = s.Date({ opt: true });

        assert.doesNotThrow(function() {
            schema.validate(undefined);
        });

    });

    it("should accept a valid Date", function() {
        let schema = s.Date();
        assert.equal(schema.validate(old).getTime(), old.getTime());
    });

    it("should reject an invalid Date", function() {
        let schema = s.Date();
        assert.throws(function() {
            schema.validate(notADate);
        }, Error);
    });

    it("should accept a valid Date as a string", function() {
        let schema = s.Date();
        assert.equal(schema.validate(oldString).getTime(), old.getTime());
    });

    it("should reject a Date less than min", function() {
        let schema = s.Date({min: old});
        assert.throws(function() {
            schema.validate(older);
        }, Error);
    });

    it("should reject a Date greater than max", function() {
        let schema = s.Date({max: old});
        assert.throws(function() {
            schema.validate(now);
        }, Error);
    });
});