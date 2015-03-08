
"use strict";

import DELETEKEY from "../lib/deleteKey";

function boolParser(args, childValidators, data) {

    if(data === undefined) {
        if(args.opt) {
            return DELETEKEY;
        }
        throw new Error("required Boolean");
    }

    if(args.coerce) {
        return Boolean(data);
    }

    if(typeof data != "boolean") {
        throw new Error("expected Boolean, got:" + typeof data);
    }

    return data;

}

export default {
    name: "Boolean",
    fn:   boolParser
};
