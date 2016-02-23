
"use strict";

const assert = require("assert");
const s      = require("../src");

describe("FastNumber validator", function() {
  let small        = 2;
  let large        = 900000000001;
  let stringNumber = "123";
  let notANumber   = {};

  it("should require value", function() {
    let schema = s.FastNumber();
    assert.throws(function() {
      schema.validate();
    });
  });

  it("should accept a valid Number", function() {
    let schema = s.FastNumber();
    assert.equal(schema.validate(small), small);
  });

  it("should reject an invalid Number", function() {
    let schema = s.FastNumber();
    assert.throws(function() {
      schema.validate(notANumber);
    }, Error);
  });

  it("should accept a valid Number as a string", function() {
    let schema = s.FastNumber();
    assert.equal(schema.validate(stringNumber), 123);
  });

});
