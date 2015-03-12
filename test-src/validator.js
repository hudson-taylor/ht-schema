
"use strict";

const assert = require("assert");
const s      = require("../");

describe("Validator", function() {

  it("should call docFunc with args", function(done) {

    let args = {
      hello: "world"
    };

    var p = s.makeParser(() => {}, function(_args) {
      assert.deepEqual(_args, args);
      done();
    });

    var schema = p(args);

    schema.document();

  });

  it("should be able to access child validators of object schema", function() {

    let a = s.Number();

    let schema = s.Object({
      a: a,
      b: s.Number(),
      c: s.Number()
    });

    for(var k in schema.$validators) {
      let r = Object.getOwnPropertyDescriptor(schema, k);
      assert.notEqual(r.get, undefined);
    }

    // should be able to validate specific fields
    schema.a.validate(5);

  });

  describe("clone", function() {

    it("should be able to clone existing schema", function() {

      var schema = s.Boolean();

      assert.equal(typeof schema.clone, 'function');

      schema.validate(true);

      var newSchema = schema.clone();

      newSchema.validate(false);

      assert.notEqual(schema, newSchema);

    });

    it("should clone object schema with specific whitelist", function() {

      var schema = s.Object({
        a: s.Boolean(),
        b: s.String(),
        c: s.Number()
      });

      schema.validate({
        a: true,
        b: "hello",
        c: 42
      });

      var newSchema = schema.clone([ 'a', 'c' ]);

      assert.throws(function() {
        newSchema.validate({
          a: true,
          b: "hello",
          c: 42
        });
      });

      schema.validate({
        a: true,
        b: "hello",
        c: 42
      });

    });

    it("should replace 'args' of schema if called with an object", function() {

      var schema = s.String({ enum: [ "hello", "world" ] });

      schema.validate("hello");

      assert.throws(function() {
        schema.validate("nope");
      });

      var newSchema = schema.clone({ enum: [ "nope" ] });

      assert.throws(function() {
        newSchema.validate("hello");
      });

      newSchema.validate("nope");

    });

    it("should merge 'args' if arg has new keys", function() {

      var schema = s.Object({ opt: false, strict: false }, {
        a: s.Number()
      });

      schema.validate({ a: 5, b: 10 });

      assert.throws(function() {
        schema.validate();
      });

      var newSchema = schema.clone({ opt: true });

      newSchema.validate();

      // should keep strict: false
      newSchema.validate({
        a: 5,
        b: 10
      });

    });

    it("should be able to pass multiple arguments", function() {

      var schema = s.Object({
        a: s.Number(),
        b: s.Number()
      });

      schema.validate({
        a: 5,
        b: 5
      });

      assert.throws(function() {

        // strict by default
        schema.validate({
          a: 5
        });

        // not optional by default
        schema.validate();

      });

      var newSchema = schema.clone([ 'a' ], { opt: true });

      newSchema.validate({
        a: 5
      });

      newSchema.validate();

      assert.throws(function() {
        // b was removed
        newSchema.validate({
          a: 5,
          b: 5
        });
      });

    });

    it("should ignore argument if not array or object", function() {

      var schema = s.Object({
        a: s.Number()
      });
      schema.validate({
        a: 5
      });
      var newSchema = schema.clone("hello!");
      newSchema.validate({
        a: 10
      });

      var newSchema2 = schema.clone(false);
      newSchema2.validate({
        a: 15
      });

    });

  });

});