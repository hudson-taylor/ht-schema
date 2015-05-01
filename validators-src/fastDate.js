
"use strict";

function fastDateValidator(args, childValidators, data) {

    let d = new Date(data);

    if(!(d instanceof Date) || isNaN(d.getTime())) {
        throw new Error("required date or Date compatible string, received (" + typeof data + ") " + data.toString());
    }

    return d;
    
}

export default {
    name: "FastDate",
    fn:   fastDateValidator
};
