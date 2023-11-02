"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isID(value) {
    const idRegex = /^\d+$/;
    return idRegex.test(value);
}
exports.default = isID;
