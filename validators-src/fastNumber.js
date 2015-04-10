
"use strict";

function fastNumberParser(args, childValidators, data) {

    let d = Number(data);

    if(isNaN(d)) {
      throw new Error("required Number, received " + typeof data);
    }

    return d;

}

export default {
    name: "FastNumber",
    fn:   fastNumberParser
};