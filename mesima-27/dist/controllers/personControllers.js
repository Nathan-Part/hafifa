"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifId = exports.validateObj = exports.deleteUser = exports.editUser = exports.addUser = exports.getUsers = void 0;
const models_1 = require("../schemas/models");
const personSchema_1 = __importDefault(require("../schemas/personSchema"));
const getUsers = async () => {
    return await models_1.PersonModel.find({});
};
exports.getUsers = getUsers;
const addUser = async (data) => {
    return new models_1.PersonModel(data).save();
};
exports.addUser = addUser;
const editUser = async (id, data) => {
    await models_1.PersonModel.updateOne({ _id: id }, data);
};
exports.editUser = editUser;
const deleteUser = async (id) => {
    await models_1.PersonModel.deleteOne({ _id: id });
    await models_1.PersonInGroupModel.deleteMany({ personId: id });
};
exports.deleteUser = deleteUser;
function validateObj(obj) {
    const newKeys = Object.keys(obj); // all properties of the new object
    const correctKeys = Object.keys(personSchema_1.default.obj); // all properties of the schema
    const obligatoryKeys = Object.keys(personSchema_1.default.obj).filter((key) => personSchema_1.default.obj[key].required);
    const missing = obligatoryKeys.filter((key) => !newKeys.includes(key)); // check if all property obligatory is here
    console.log(newKeys, correctKeys, obligatoryKeys, missing);
    if (missing.length === 0) {
        const getExtraFields = newKeys.filter(key => !correctKeys.includes(key));
        for (const property of getExtraFields) {
            delete obj[property];
        }
        console.log(getExtraFields, obj);
        return {
            isValide: true,
            object: obj
        };
    }
    else {
        const error = "you have not completed the field: " + missing.join(', ');
        return {
            isValide: false,
            error: error,
            object: obj
        };
    }
}
exports.validateObj = validateObj;
const verifId = async (id) => {
    const countLetter = id.length;
    if (countLetter == 24) {
        console.log("count", countLetter);
        const verifId = await models_1.PersonModel.findById(id);
        console.log("verifid", verifId);
        if (verifId) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
exports.verifId = verifId;
