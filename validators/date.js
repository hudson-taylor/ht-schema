
"use strict";

var merge     = require("../lib/merge");
var DELETEKEY = require("../lib/deleteKey");

function dateParser(args, childValidators, data) {
    args = merge(args, {min: null, max : null});
    if(!data && !args.opt) throw new Error("required Date");
    if(!data && args.opt) return DELETEKEY;
    var origType = typeof data;
    var d = new Date(data);
    if(!(d instanceof Date) || isNaN(d.getTime())) {
        throw new Error("required date or Date compatible string, received ("+
                origType+") "+ data.toString());
    }
    if(args.min && d.getTime() < new Date(args.min).getTime()) {
        throw new Error("must be greater than "+new Date(args.min));
    }
    if(args.max && d.getTime() > new Date(args.max).getTime()) {
        throw new Error("must be less than or equal to "+new Date(args.max));
    }
    return d;
}

module.exports = {
    name: "Date",
    fn:   dateParser
};
