"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifId = exports.getChilds = exports.getGroupByName = exports.getMergedChildGroups = exports.deleteGroup = exports.editGroup = exports.validateGroup = exports.addGroup = exports.getGroups = void 0;
const models_1 = require("../schemas/models");
const groupSchema_1 = __importDefault(require("../schemas/groupSchema"));
const getGroups = async () => {
    return await models_1.GroupModel.find();
};
exports.getGroups = getGroups;
const addGroup = async (data) => {
    try {
        const group = new models_1.GroupModel(data);
        const savedGroup = await group.save();
        return savedGroup;
    }
    catch (error) {
        console.log(error.errors.name.properties.message);
    }
};
exports.addGroup = addGroup;
function validateGroup(obj) {
    const newKeys = Object.keys(obj); // all properties of the new object
    const correctKeys = Object.keys(groupSchema_1.default.obj); // all properties of the schema
    const obligatoryKeys = Object.keys(groupSchema_1.default.obj).filter((key) => groupSchema_1.default.obj[key].required);
    const missing = obligatoryKeys.filter((key) => !newKeys.includes(key)); // check if all property obligatory is here
    if (missing.length === 0) {
        const getExtraFields = newKeys.filter(key => !correctKeys.includes(key));
        for (let i = 0; i < getExtraFields.length; i++) {
            delete obj[getExtraFields[i]];
        }
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
exports.validateGroup = validateGroup;
const editGroup = async (id, data) => {
    await models_1.GroupModel.updateOne({ _id: id }, data);
};
exports.editGroup = editGroup;
const deleteGroup = async (childIds) => {
    for (let i = 0; i < childIds.length; i++) {
        await models_1.GroupModel.deleteOne({ _id: childIds[i] });
        await models_1.PersonInGroupModel.deleteMany({ groupId: childIds[i] });
    }
};
exports.deleteGroup = deleteGroup;
const getMergedChildGroups = async (id) => {
    const parent = await models_1.GroupModel.findById(id);
    if (!parent) {
        return {};
    }
    const children = await models_1.GroupModel.find({ groupFather: id });
    for await (const child of children) {
        parent.set({ groups: [...parent?.groups || [], await (0, exports.getMergedChildGroups)(child._id.toString())] });
    }
    return parent;
};
exports.getMergedChildGroups = getMergedChildGroups;
const getGroupByName = async (name) => {
    return await models_1.GroupModel.find({ name: name });
};
exports.getGroupByName = getGroupByName;
async function getChilds(groupId) {
    const childIds = [];
    const groups = await models_1.GroupModel.find({ groupFather: groupId });
    for (const group of groups) {
        childIds.push(group._id.toString());
        const grandchildrenIds = await getChilds(group._id.toString());
        if (grandchildrenIds.length !== 0) {
            childIds.push(...grandchildrenIds);
        }
    }
    return childIds;
}
exports.getChilds = getChilds;
const verifId = async (id) => {
    const countLetter = id.length;
    if (countLetter == 24) {
        const verifId = await models_1.GroupModel.findById(id);
        console.log(verifId);
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
