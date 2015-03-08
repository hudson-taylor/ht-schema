
"use strict";

import assert from "assert";
import s      from "../";

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
        let schema = s.Array([ s.Any() ]);
        schema.validate([ true, 5, "hello" ]);
    });

});