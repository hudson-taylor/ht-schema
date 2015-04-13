
"use strict";

const assert = require("assert");
const s      = require("../");

describe("Validator", function() {

  it("should be able to access child validators of object schema", function() {

    let a = s.Number();

    let schema = s.Object({
      a: a,
      b: s.Number(),
      c: s.Number()
    });

    for(var k in schema.$validators) {
      let r = Object.getOwnPropertyDescriptor(schema.keys, k);
      assert.notEqual(r.get, undefined);
    }

    // should be able to validate specific fields
    schema.keys.a.validate(5);

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

  describe("Fast Validators", function() {

    it("should require fast validator if no arguments are passed", function() {

      const tests = {
        "String":  "fastStrParser",
        "Date":    "fastDateParser",
        "Number":  "fastNumberParser",
        "Email":   "fastEmailParser",
        "Boolean": "fastBoolParser"
      }

      for(let k in tests) {
        const schema = s[k]();
        assert.equal(schema.$parserFunc.name, tests[k]);
      }

    });

    it("should not require fast validator if arguments are passed", function() {

      const tests = {
        "String":  "strParser",
        "Date":    "dateParser",
        "Number":  "numParser",
        "Email":   "emailParser",
        "Boolean": "boolParser"
      }

      for(let k in tests) {
        const schema = s[k]({ opt: true, some: "other_value" });
        assert.equal(schema.$parserFunc.name, tests[k]);
      }

    });

  });

  describe("document", function() {

    it("should correctly dump information for simple schema", function() {

      let matches = {
        "String": { opt: true },
        "Number": { opt: false },
        "Boolean": { opt: true }
      }

      for(var k in matches) {
        var schema = s[k](matches[k]);
        assert.deepEqual(schema.document(), {
          name: k,
          args: matches[k]
        });
      }

    });

    it("should correctly dump info for more complex schema", function() {

      let schema = s.Object({
        one: s.Object({
          two: s.Object({
            three: s.String(),
            four:  s.Number({ opt: true })
          })
        })
      });

      assert.deepEqual(schema.document(), {
        name: "Object",
        args: {},
        children: {
          one: {
            name: "Object",
            args: {},
            children: {
              two: {
                name: "Object",
                args: {},
                children: {
                  three: {
                    name: "FastString",
                    args: {}
                  },
                  four: {
                    name: "Number",
                    args: { opt: true }
                  }
                }
              }
            }
          }
        }
      });

    });

    it("should return children as array for Array validator", function() {

      let schema = s.Array([ s.String(), s.Number() ]);

      assert.deepEqual(schema.document(), {
        name: "Array",
        args: {},
        children: [
          {
            name: "FastString",
            args: {}
          },
          {
            name: "FastNumber",
            args: {}
          }
        ]
      });

    });

  });

  describe("comment", function() {

    it("should allow adding comment to validator", function() {

      let schema = s.Object({
        hello: s.String().comment('hello')
      });

      assert.deepEqual(schema.document(), {
        name: "Object",
        args: {},
        children: {
          hello: {
            name: "FastString",
            args: {},
            comment: "hello"
          }
        }
      });

    });

    it("should allow comment to be a function", function() {

      let args = {
        hello: "world!!!!!$"
      };

      let commentFn = function(obj) {
        return {
          hello: obj.args
        }
      }

      let schema = s.Object({
        key: s.String(args).comment(commentFn)
      });

      assert.deepEqual(schema.document(), {
        name: "Object",
        args: {},
        children: {
          key: {
            name: "String",
            args: args,
            comment: {
              hello: args
            }
          }
        }
      });

    });

  });

});