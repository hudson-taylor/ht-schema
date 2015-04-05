
"use strict";

function fastNumberParser(args, childValidators, data) {

    data = Number(data);

    if(isNaN(data)) {
        throw new Error("required Number, got: " + typeof data);
    }

    return data;

}

export default {
    name: "FastNumber",
    fn:   fastNumberParser
};
