
"use strict";

const isemail = require("isemail");

function fastEmailValidator(args, childValidators, data) {

    let type = typeof data;

    if(type !== "string") {
        throw new Error("required Email (string): got " + type);
    }

    data = data.trim().toLowerCase();

    if(!isemail(data)) {
        throw new Error("Invalid Email: " + data);
    }

    return data;

}

export default {
    name: "FastEmail",
    fn:   fastEmailValidator
};
