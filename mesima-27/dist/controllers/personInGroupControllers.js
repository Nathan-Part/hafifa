"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfExist = exports.addUserInGroup = exports.getGroupsDetails = exports.deletePersonInGroup = exports.findGroupById = void 0;
const models_1 = require("../schemas/models");
const findGroupById = async (id) => {
    return await models_1.PersonInGroupModel.find({ personId: id });
};
exports.findGroupById = findGroupById;
const deletePersonInGroup = async (personId, groupId) => {
    await models_1.PersonInGroupModel.deleteOne({ personId: personId, groupId: groupId });
};
exports.deletePersonInGroup = deletePersonInGroup;
const getGroupsDetails = async (groupsOfUser) => {
    const hisGroups = [];
    for (let i = 0; i < groupsOfUser.length; i++) {
        const hisGroup = await models_1.GroupModel.findById(groupsOfUser[i].groupId);
        if (hisGroup) {
            hisGroups.push(hisGroup);
        }
    }
    return hisGroups;
};
exports.getGroupsDetails = getGroupsDetails;
const addUserInGroup = async (personId, groupId) => {
    return new models_1.PersonInGroupModel({ personId: personId, groupId: groupId }).save();
};
exports.addUserInGroup = addUserInGroup;
const checkIfExist = async (personId, groupId) => {
    const countLetter = groupId.toString().length;
    if (countLetter == 24) {
        const verifGroup = await models_1.GroupModel.findById(groupId);
        if (verifGroup) {
            const verif = await models_1.PersonInGroupModel.find({ personId: personId, groupId: groupId });
            if (verif.length == 0) {
                return true;
            }
            else {
                return {
                    isValide: false,
                    error: "You can't put the same group twice to this user"
                };
            }
        }
        else {
            return {
                isValide: false,
                error: "id of the group doesn't exist"
            };
        }
    }
    else {
        return {
            isValide: false,
            error: "ahi ein matsav che ze objectId"
        };
    }
};
exports.checkIfExist = checkIfExist;
