
"use strict";

const assert = require("assert");
const s      = require("../");

describe("Date validator", function() {
  let old       = new Date("1979");
  let older     = new Date("1970");
  let now       = new Date();
  let notADate  = { dinosaur: "rawwwr" };

  it("should require value", function() {

    let schema = s.Date({ opt: false });

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
    let schema = s.Date({ opt: false });
    assert.equal(schema.validate(old).getTime(), old.getTime());
  });

  it("should reject an invalid Date", function() {
    let schema = s.Date({ opt: false });
    assert.throws(function() {
      schema.validate(notADate);
    }, Error);
  });

  it("should reject a Date less than min", function() {
    let schema = s.Date({ min: old });
    assert.throws(function() {
      schema.validate(older);
    }, Error);
  });

  it("should reject a Date greater than max", function() {
    let schema = s.Date({ max: old });
    assert.throws(function() {
      schema.validate(now);
    }, Error);
  });

  it("should reject non-date if parse if not true", function() {

    let schema = s.Date();

    assert.throws(function() {
      schema.validate("Wed Jun 10 2015 20:36:48 GMT+1000 (AEST)");
    });

  });

  it("should accept non-date if parse is true", function() {

    let schema = s.Date({ parse: true });
    let date = schema.validate("Wed Jun 10 2015 20:36:48 GMT+1000 (AEST)");

    assert.equal(date.getMinutes(), 36);

  });

  it("should reject non-date compatible string if parse is true", function() {

    let schema = s.Date({ parse: true });

    assert.throws(function() {
      schema.validate("hello");
    });

  });

});