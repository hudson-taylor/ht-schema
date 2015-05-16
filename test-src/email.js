
"use strict";

const assert = require("assert");
const s      = require("../");

describe("Email validator", function() {

  it("should require value", function() {

    let schema = s.Email({ opt: false });

    assert.throws(function() {
      schema.validate();
    });

  });

  it("should allow optional value if opt is set", function() {

    let schema = s.Email({ opt: true });

    assert.doesNotThrow(function() {
      schema.validate(undefined);
    });

  });

  it("should require string", function() {

    let schema = s.Email({ opt: false });

    assert.throws(function() {
      schema.validate(true);
    });

  });

  it("should accept valid email addresses", function() {
    let schema = s.Email({ opt: false });
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

  it("should normalize email if option is set", function() {

    let schema = s.Email({ normalize: true });

    let email = "TesT@heLLo.CoM";

    let result = schema.validate(email);

    assert.equal(result, email.toLowerCase());

  });

  it("should not normalize if options is not set", function() {

    let schema = s.Email({ normalize: false });

    let email = "TesT@heLLo.CoM";

    assert.equal(schema.validate(email), email);

  });

});