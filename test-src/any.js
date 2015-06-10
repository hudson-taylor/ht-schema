
"use strict";

const assert = require("assert");
const s      = require("../");

describe("Any validator", function() {

  it("should require value", function() {
    let schema = s.Any();
    assert.throws(function() {
      schema.validate();
    });
  });

  it("should allow optional value", function() {
    let schema = s.Any({ opt: true });
    schema.validate();
  });

  it("should allow any value", function() {
    let schema = s.Any();
    schema.validate(true);
    schema.validate(5);
    schema.validate("hello");
  });

});