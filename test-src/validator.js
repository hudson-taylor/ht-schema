
"use strict";

const assert = require("assert");
const s      = require("../");

describe("Validator", function() {

  it("should call docFunc with args", function(done) {

    let args = {
      hello: "world"
    }

    var p = s.makeParser(() => {}, function(_args) {
      assert.deepEqual(_args, args);
      done();
    });

    var schema = p(args);

    schema.document();

  });

});