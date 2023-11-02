"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORT 
const express_1 = __importDefault(require("express"));
// Model
const models_1 = require("../schemas/models");
const personControllers_1 = require("../controllers/personControllers");
const personInGroupControllers_1 = require("../controllers/personInGroupControllers");
const mongodb_1 = require("mongodb");
const personRouter = express_1.default.Router();
personRouter.get('/group/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const groupsOfUser = await (0, personInGroupControllers_1.findGroupById)(id);
        const hisGroups = await (0, personInGroupControllers_1.getGroupsDetails)(groupsOfUser);
        res.send(hisGroups);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error has been occured while your research.");
    }
});
personRouter.get('/', async (req, res) => {
    try {
        // Obtenir tous les utilisateurs
        const users = await (0, personControllers_1.getUsers)();
        const result = await Promise.all(users.map(async (user) => {
            const memberships = await models_1.PersonInGroupModel.find({ personId: user._id }).populate('groupId', null, 'Group');
            return {
                _id: user._id,
                name: user.name,
                groups: memberships.map(membership => membership.groupId)
            };
        }));
        res.send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error has been occured while your research.");
    }
});
personRouter.post('/create', async (req, res) => {
    try {
        const personData = req.body;
        const groupId = req.body.group; // take the id of the group
        const verifPerson = (0, personControllers_1.validateObj)(personData);
        if (verifPerson.isValide) {
            const newPerson = await (0, personControllers_1.addUser)(personData);
            if (groupId) {
                const personId = newPerson._id; // take the new id of the user
                const checking = await (0, personInGroupControllers_1.checkIfExist)(personId, groupId);
                if (checking === true) // check if its doesn't exist before
                 {
                    (0, personInGroupControllers_1.addUserInGroup)(personId, groupId);
                    res.send("A person has been successfully added to group");
                }
                else {
                    res.status(500).send(checking.error);
                }
            }
            else {
                res.send("A person has been successfully created");
            }
        }
        else {
            res.status(404).send(verifPerson.error);
        }
    }
    catch (error) {
        res.status(500).send("An error has been occured during the creation");
    }
});
personRouter.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (await (0, personControllers_1.verifId)(id)) {
            const personData = req.body;
            const groupId = req.body.group;
            const verifPerson = (0, personControllers_1.validateObj)(personData);
            if (verifPerson.isValide) {
                (0, personControllers_1.editUser)(id, personData);
                if (groupId) {
                    const personId = new mongodb_1.ObjectId(id);
                    const checking = await (0, personInGroupControllers_1.checkIfExist)(personId, groupId);
                    if (checking === true) // check if its doesn't exist before
                     {
                        (0, personInGroupControllers_1.addUserInGroup)(personId, groupId);
                        res.send("A person has been successfully added to group");
                    }
                    else {
                        res.status(500).send(checking.error);
                    }
                }
                else {
                    res.send("The person has been successfully modified");
                }
            }
            else {
                res.status(404).send(verifPerson.error);
            }
        }
        else {
            res.status(404).send("id of this person doesn't exist");
        }
    }
    catch (error) {
        res.status(500).send("An error has been occured during the editing.");
    }
});
personRouter.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (await (0, personControllers_1.verifId)(id)) {
            (0, personControllers_1.deleteUser)(id);
            res.send("The person has been successfully deleted");
        }
        else {
            res.status(404).send("id of this person doesn't exist");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("An error has been occured during the deleting.");
    }
});
exports.default = personRouter;
