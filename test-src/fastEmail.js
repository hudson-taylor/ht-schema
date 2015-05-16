
"use strict";

const assert = require("assert");
const s      = require("../");

describe("FastEmail validator", function() {

  it("should require value", function() {

    let schema = s.FastEmail();

    assert.throws(function() {
      schema.validate();
    });

  });

  it("should require string", function() {

    let schema = s.FastEmail();

    assert.throws(function() {
      schema.validate(true);
    });

  });

  it("should accept valid email addresses", function() {
    let schema = s.FastEmail();
    let valid = [
      "mel@example.com",
      "mel+chickensGoBrrrk@example.com",
      "root@127.0.0.1"
    ];
    let invalid = [
      "notanemailaddress",
      "this has spaces @ foo"
    ];
    valid.forEach(function(e) {
      assert.equal(schema.validate(e), e.toLowerCase());
    });
    invalid.forEach(function(e) {
      assert.throws(function() {
        schema.validate(e);
      }, Error);
    });
  });

});