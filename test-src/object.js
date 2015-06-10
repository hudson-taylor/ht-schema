
"use strict";

const assert = require("assert");
const s      = require("../");

describe("Object validator", function() {

  let ceilingCat  = { name: "Pixel", colour: "purple"                  };
  let specialCat  = { name: "Pixel", colour: "purple",  lasers: true   };
  let purryCat    = { name: "Pixel", colour: "purple",  goes:   "purr" };
  let catOwner    = { name: "Bea",   cat:    ceilingCat                };
  let basementCat = { name: "Penny"                                    };

  it("should require value", function() {
    let schema = s.Object();
    assert.throws(function() {
      schema.validate();
    });
  });

  it("should allow optional value if opt is set", function() {
    let schema = s.Object({ opt: true });
    assert.doesNotThrow(function() {
      schema.validate();
    });
  });

  it("should require object as value", function() {
    let schema = s.Object();
    assert.throws(function() {
      schema.validate("notAnObject");
    });
  });

  it("should accept a strictly valid object", function() {
    let catSchema = s.Object({
      name:   s.String(),
      colour: s.String()
    });
    assert.deepEqual(catSchema.validate(ceilingCat), ceilingCat);
  });

  it("should reject an invalid object", function() {
    let catSchema = s.Object({
      name:   s.String(),
      colour: s.String()
    });
    assert.throws(function() {
      catSchema.validate(basementCat);
    }, Error);
  });

  it("should accept extra attributes with strict set false", function() {
    let catSchemaPermissive = s.Object({ strict: false }, {
      name:   s.String(),
      colour: s.String()
    });
    assert.deepEqual(catSchemaPermissive.validate(specialCat), specialCat);
  });

  it("should rename attributes with keys of the form 'foo as bar'", function() {
    let schema = s.Object({
      "name as catName": s.String(),
      colour:            s.String()
    });
    assert.equal(schema.validate(ceilingCat).catName, "Pixel");
  });

  it("should apply a '*' validator to unknown fields with strict set false", function() {
    let catSchemaPermissiveWithStar = s.Object({ strict: false }, {
      name: s.String(),
      colour: s.String(),
      "*": s.String({
        enum: [ "meow", "purr" ]
      })
    });
    assert.throws(function() {
      catSchemaPermissiveWithStar.validate(specialCat);
    }, Error);
    assert.deepEqual(catSchemaPermissiveWithStar.validate(purryCat), purryCat);
  });

  it("should throw is extra keys are passed in when set to strict", function() {

    var schema = s.Object({
      strict: true
    }, {
      s: s.String()
    });

    assert.deepEqual(schema.validate({ s: "a" }), { s: "a" });
    assert.throws(function() {
      schema.validate({
        s: "a",
        z: "oops"
      });
    });

  });

  it("should delete keys that return DELETEKEY", function() {
    let catSchema = s.Object({
      name:   s.String({ opt: true }),
      colour: s.String()
    });
    let data = { colour: "blue" };
    let out  = catSchema.validate(data);
    assert.deepEqual(out, data);
  });

  it("should accept null if optional", function() {
    let catSchema = s.Object({ opt: true }, {
      name:   s.String(),
      colour: s.String()
    });
    assert.deepEqual(catSchema.validate(null), null);
  });

  it("should use default value if missing key (or value)", function() {
    let catSchema = s.Object({}, {
      name: s.String({ default: "something" })
    });
    assert.deepEqual(catSchema.validate({}), { name: "something" });
  });

  it("should be composible", function() {

    let catSchema = s.Object({ opt: true }, {
      name:   s.String(),
      colour: s.String()
    });

    let ownerSchema = s.Object({
      name: s.String(),
      cat:  catSchema
    });
    assert.deepEqual(ownerSchema.validate(catOwner), catOwner);
  });

  it("should allow default option for child validators", function() {

    let schema = s.Object({
      hello: s.String({ opt: true, default: "world" })
    });

    let schema2 = s.Object({
      obj: s.Object({ opt: true , default: {} })
    });

    assert.deepEqual(schema.validate({}), {
      hello: "world"
    });

    assert.deepEqual(schema2.validate({}), {
      obj: {}
    });

  });

});
