
"use strict";

const assert = require("assert");
const s      = require("../");

describe("FastDate validator", function() {

  const old       = new Date("1979");
  const oldString = "1979";
  const older     = new Date("1970");

  it("should require value", function() {

    let schema = s.FastDate();

    assert.throws(function() {
      schema.validate();
    });

  });

  it("should accept a valid Date", function() {
    let schema = s.FastDate();
    assert.equal(schema.validate(old).getTime(), old.getTime());
  });

  it("should reject an invalid Date", function() {
    let schema = s.FastDate();
    assert.throws(function() {
      schema.validate({ dinosaur: "rawwwr" });
    }, Error);
  });

});