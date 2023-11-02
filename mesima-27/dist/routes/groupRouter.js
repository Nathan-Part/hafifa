"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORT
const express_1 = __importDefault(require("express"));
const groupControllers_1 = require("../controllers/groupControllers");
const groupControllers_2 = require("../controllers/groupControllers");
const personInGroupControllers_1 = require("../controllers/personInGroupControllers");
const mongodb_1 = require("mongodb");
const groupRouter = express_1.default.Router();
groupRouter.get("/hierarchy", async (req, res) => {
    try {
        const allGroup = await (0, groupControllers_1.getGroups)();
        let mergedGroup = [];
        for (let i = 0; i < allGroup.length; i++) {
            const group = await (0, groupControllers_1.getMergedChildGroups)(allGroup[i]._id.toString());
            mergedGroup = mergedGroup.concat(group);
        }
        res.send(mergedGroup);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error has been occured while your research.");
    }
});
groupRouter.get("/search/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const listGroup = await (0, groupControllers_1.getGroupByName)(name);
        res.send(listGroup);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error has been occured while your research.");
    }
});
groupRouter.get("/", async (req, res) => {
    try {
        const listGroup = await (0, groupControllers_1.getGroups)();
        res.send(listGroup);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error has been occured while your research.");
    }
});
groupRouter.post("/create", async (req, res) => {
    try {
        // crée un document
        const groupData = req.body;
        const newGroup = (0, groupControllers_1.validateGroup)(groupData);
        if (newGroup.isValide) {
            console.log(newGroup.object);
            const cGroup = await (0, groupControllers_1.addGroup)(newGroup.object);
            console.log(cGroup, "tomerrrr");
            res.send(cGroup);
        }
        else {
            res.status(404).send(newGroup.error);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error has been occured during the creation");
    }
});
groupRouter.get("/addPerson/:personId/:groupId", async (req, res) => {
    try {
        const personId = new mongodb_1.ObjectId(req.params.personId);
        const groupId = new mongodb_1.ObjectId(req.params.groupId);
        const checking = await (0, personInGroupControllers_1.checkIfExist)(personId, groupId);
        if (checking === true) {
            (0, personInGroupControllers_1.addUserInGroup)(personId, groupId);
            res.send("A person has been successfully added to group");
        }
        else {
            res.status(500).send(checking.error);
        }
    }
    catch {
        res.status(500).send("An error has been occured during the editing.");
    }
});
groupRouter.post("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (await (0, groupControllers_2.verifId)(id)) {
            const groupFather = req.body.groupFather;
            // return all child of this group for check if I can put this on this groupFather
            const childIds = await (0, groupControllers_1.getChilds)(id);
            childIds.push(id);
            const groupData = req.body;
            if (!childIds.includes(groupFather)) {
                const newGroup = (0, groupControllers_1.validateGroup)(groupData, "name");
                if (newGroup.isValide) {
                    console.log(newGroup.object);
                    (0, groupControllers_1.editGroup)(id, groupData);
                    res.send("The group has been successfully modified");
                }
                else {
                    res.status(404).send(newGroup.error);
                }
            }
            else {
                res.status(500).send("You can't put this id on this group");
            }
        }
        else {
            res.status(404).send("id of this group doesn't exist");
        }
    }
    catch (error) {
        res.status(500).send("An error has been occured during the editing.");
    }
});
groupRouter.get("/deleteFather/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (await (0, groupControllers_2.verifId)(id)) {
            (0, groupControllers_1.deleteGroupFather)(id);
            res.send("The groupFather has been successfully removed");
        }
        else {
            res.status(404).send("id of this group doesn't exist");
        }
    }
    catch (error) {
        res.status(500).send("An error has been occured during the editing.");
    }
});
groupRouter.get("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (await (0, groupControllers_2.verifId)(id)) {
            const childIds = await (0, groupControllers_1.getChilds)(id);
            childIds.push(id);
            (0, groupControllers_1.deleteGroup)(childIds);
            res.send("The groups has been successfully deleted");
        }
        else {
            res.status(404).send("id of this group doesn't exist");
        }
    }
    catch (error) {
        res.status(500).send("An error has been occured during the deleting.");
    }
});
exports.default = groupRouter;
