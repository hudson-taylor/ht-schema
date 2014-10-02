
"use strict";

function merge() {
    // Merge objects passed as arguments, left to right precidence.
    var result = {};
    for (var i = 0; i < arguments.length; i++) {
        var keys = Object.keys(arguments[i]);
        for (var k = 0; k < keys.length; k++) {
            var key = keys[k];
            if(!result.hasOwnProperty(key)) {
                result[key] = arguments[i][key];
            }
        }
    }
    return result;
}

module.exports = merge;
