"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var personInGroupSchema = new mongoose_1.Schema({
    personId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Person'
    },
    groupId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Group'
    }
});
exports.default = personInGroupSchema;
