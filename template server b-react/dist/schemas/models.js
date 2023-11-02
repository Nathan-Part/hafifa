"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonInGroupModel = exports.PersonModel = exports.GroupModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//schema 
const groupSchema_1 = __importDefault(require("./groupSchema"));
const personSchema_1 = __importDefault(require("./personSchema"));
const personInGroupSchema_1 = __importDefault(require("./personInGroupSchema"));
// Model
const GroupModel = mongoose_1.default.model('Group', groupSchema_1.default);
exports.GroupModel = GroupModel;
const PersonModel = mongoose_1.default.model('Person', personSchema_1.default);
exports.PersonModel = PersonModel;
var PersonInGroupModel = mongoose_1.default.model('Ingroup', personInGroupSchema_1.default);
exports.PersonInGroupModel = PersonInGroupModel;
