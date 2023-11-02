// IMPORT
import express, { Request } from "express";

// types
import { PersonInterface, GroupInterface } from "../types";

// Model
import { PersonInGroupModel } from "../schemas/models";

import {
  addUser,
  deleteUser,
  editUser,
  getUsers,
  validateObj,
  verifId,
} from "../controllers/personControllers";
import {
  addUserInGroup,
  checkIfExist,
  deletePersonInGroup,
  findGroupById,
  getGroupsDetails,
} from "../controllers/personInGroupControllers";
import { ObjectId } from "mongodb";

const personRouter = express.Router();

personRouter.get("/group/:id", async (req: Request, res) => {
  try {
    const id = req.params.id;
    const groupsOfUser = await findGroupById(id);

    const hisGroups: GroupInterface[] = await getGroupsDetails(groupsOfUser);
    res.send(hisGroups);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error has been occured while your research.");
  }
});

personRouter.get("/", async (req: Request, res) => {
  try {
    // Obtenir tous les utilisateurs
    const users = await getUsers();

    const result = await Promise.all(
      users.map(async (user) => {
        const memberships = await PersonInGroupModel.find({
          personId: user._id,
        }).populate("groupId", null, "Group");

        return {
          _id: user._id,
          name: user.name,
          groups: memberships.map((membership) => membership.groupId),
        };
      })
    );

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error has been occured while your research.");
  }
});

personRouter.post("/create", async (req: Request, res) => {
  try {
    const personData: PersonInterface = req.body;
    const groupId: ObjectId = req.body.group; // take the id of the group
    const verifPerson = validateObj(personData);
    if (verifPerson.isValide) {
      const newPerson = await addUser(personData);
      if (groupId) {
        const personId: ObjectId = newPerson._id; // take the new id of the user
        const checking = await checkIfExist(personId, groupId);
        if (checking === true) {
          // check if its doesn't exist before
          addUserInGroup(personId, groupId);
          res.send("A person has been successfully added to group");
        } else {
          res.status(500).send(checking.error);
        }
      } else {
        res.send("A person has been successfully created");
      }
    } else {
      res.status(404).send(verifPerson.error);
    }
  } catch (error) {
    res.status(500).send("An error has been occured during the creation");
  }
});

personRouter.post("/update/:id", async (req: Request, res) => {
  try {
    const id = req.params.id;
    if (await verifId(id)) {
      const personData: PersonInterface = req.body;
      const groupId: ObjectId = req.body.group;

      const verifPerson = validateObj(personData);
      if (verifPerson.isValide) {
        editUser(id, personData);
        if (groupId) {
          const personId: ObjectId = new ObjectId(id);

          const checking = await checkIfExist(personId, groupId);
          if (checking === true) {
            // check if its doesn't exist before
            addUserInGroup(personId, groupId);
            res.send("A person has been successfully added to group");
          } else {
            res.status(500).send(checking.error);
          }
        } else {
          res.send("The person has been successfully modified");
        }
      } else {
        res.status(404).send(verifPerson.error);
      }
    } else {
      res.status(404).send("id of this person doesn't exist");
    }
  } catch (error) {
    res.status(500).send("An error has been occured during the editing.");
  }
});

personRouter.get("/delete/:id", async (req: Request, res) => {
  try {
    const id = req.params.id;
    if (await verifId(id)) {
      deleteUser(id);
      res.send("The person has been successfully deleted");
    } else {
      res.status(404).send("id of this person doesn't exist");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error has been occured during the deleting.");
  }
});

personRouter.get(
  "/deleteFromGroup/:idPerson/:idGroup",
  async (req: Request, res) => {
    try {
      const idPerson = req.params.idPerson;
      const idGroup = req.params.idGroup;
      deletePersonInGroup(idPerson, idGroup);
      res.send("The person in the group has been successfully deleted");
    } catch (error) {
      console.log(error);
      res.status(500).send("An error has been occured during the deleting.");
    }
  }
);

export default personRouter;
