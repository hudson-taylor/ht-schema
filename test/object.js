
"use strict";

var assert = require("assert");

var s = require("../index");

describe("Object validator", function() {

    var ceilingCat  = { name: "Pixel", colour: "purple"                  };
    var specialCat  = { name: "Pixel", colour: "purple",  lasers: true   };
    var purryCat    = { name: "Pixel", colour: "purple",  goes:   "purr" };
    var catOwner    = { name: "Bea",   cat:    ceilingCat                };
    var basementCat = { name: "Penny"                                    };

    it("should accept a strictly valid object", function() {
        var catSchema = s.Object({
            name:   s.String(),
            colour: s.String()
        });
        assert.deepEqual(catSchema.validate(ceilingCat), ceilingCat);
    });

    it("should reject an invalid object", function() {
        var catSchema = s.Object({
            name:   s.String(),
            colour: s.String()
        });
        assert.throws(function() {
            catSchema.validate(basementCat);
        }, Error);
    });

    it("should accept extra attributes with strict set false", function() {
        var catSchemaPermissive = s.Object({ strict: false }, {
            name:   s.String(),
            colour: s.String()
        });
        assert.deepEqual(catSchemaPermissive.validate(specialCat), specialCat);
    });

    it("should rename attributes with keys of the form 'foo as bar'", function() {
        var schema = s.Object({
            "name as catName": s.String(),
            colour:            s.String()
        });
        assert.equal(schema.validate(ceilingCat).catName, "Pixel");
    });


    it("should apply a '*' validator to unknown fields with strict set false", function() {
        var catSchemaPermissiveWithStar = s.Object({ strict: false }, {
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

    it("should delete keys that return DELETEKEY", function() {
        var catSchema = s.Object({
            name:   s.String({ opt: true }),
            colour: s.String()
        });
        var data = { colour: "blue" };
        var out  = catSchema.validate(data);
        assert.deepEqual(out, data);
    });

    it("should accept null if optional", function() {
        var catSchema = s.Object({ opt: true }, {
            name:   s.String(),
            colour: s.String()
        });
        assert.deepEqual(catSchema.validate(null), null);
    });

    it("should use default value if missing key (or value)", function() {
        var catSchema = s.Object({}, {
            name: s.String({ default: "something" })
        });
        assert.deepEqual(catSchema.validate({}), { name: "something" });
    });

    it("should be composible", function() {

        var catSchema = s.Object({ opt: true }, {
            name:   s.String(),
            colour: s.String()
        });

        var ownerSchema = s.Object({
            name: s.String(),
            cat:  catSchema
        });
        assert.deepEqual(ownerSchema.validate(catOwner), catOwner);
    });
});
