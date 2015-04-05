
"use strict";

function fastBoolParser(args, childValidators, data) {

    if(typeof data != "boolean") {
        throw new Error("expected Boolean, got:" + typeof data);
    }

    return data;

}

export default {
    name: "FastBoolean",
    fn:   fastBoolParser
};
