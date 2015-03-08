
"use strict";

var assert = require("assert");

var s = require("../");

describe("Any validator", function() {

    it("should require value", function() {
      var schema = s.Any();
      assert.throws(function() {
        schema.validate();
      });
    });

    it("should allow optional value", function() {
      var schema = s.Any({ opt: true });
      schema.validate();
    });

    it("should allow any value", function() {
        var schema = s.Array([ s.Any() ]);
        schema.validate([ true, 5, "hello" ]);
    });

});