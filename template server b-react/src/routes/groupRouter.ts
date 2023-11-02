// IMPORT 
import express, { Request } from "express"
import { GroupInterface } from '../types';
import { addGroup, deleteGroup, editGroup, getChilds, getGroupByName, getGroups, getMergedChildGroups, validateGroup } from '../controllers/groupControllers';
import { verifId } from "../controllers/groupControllers";

const groupRouter = express.Router();

groupRouter.get('/hierarchy', async (req: Request, res) => {
    try {
      const allGroup = await getGroups();
      let mergedGroup: GroupInterface[] = [];
      for (let i = 0; i < allGroup.length; i++) {
        const group = await getMergedChildGroups(allGroup[i]._id.toString());
        mergedGroup = mergedGroup.concat(group);
      }
      res.send(mergedGroup);
    }
    catch (error) {
      console.error(error);
      res.status(500).send("An error has been occured while your research.");
    }
  });

  groupRouter.get('/search/:name', async (req: Request, res) => {
    try {
      const name = req.params.name;
      const listGroup = await getGroupByName(name);
      res.send(listGroup);
    }
    catch (error) {
      console.error(error);
      res.status(500).send("An error has been occured while your research.");
    }
  });

groupRouter.get('/', async (req: Request, res) => {
    try {
      const listGroup = await getGroups();
      res.send(listGroup);
    }
    catch (error) {
      console.error(error);
      res.status(500).send("An error has been occured while your research.");
    }
  });
  
  groupRouter.post('/create', async (req: Request, res) => {
    try {
      // crée un document
      const groupData = req.body;      
      const newGroup = validateGroup(groupData);
      if(newGroup.isValide)
      {
        console.log(newGroup.object);
        addGroup(newGroup.object);
        res.send("A group has been successfully created");
      }
      else
      {
        res.status(404).send(newGroup.error);
      }
    }
    catch (error) {
      console.error(error);
      res.status(500).send("An error has been occured during the creation");
    }
  });

  groupRouter.post('/update/:id', async (req: Request, res) => {
    try {
      const {id} = req.params;
      if(await verifId(id))
      {
        const groupFather: string = req.body.groupFather;

        // return all child of this group for check if I can put this on this groupFather
        const childIds = await getChilds(id); 
        childIds.push(id);
        
        const groupData: GroupInterface = req.body;
        if(!childIds.includes(groupFather))
        {
          const newGroup = validateGroup(groupData);
          if(newGroup.isValide)
          {
            console.log(newGroup.object);
            editGroup(id, groupData)
            res.send("The group has been successfully modified");
          }
          else
          {
            res.status(404).send(newGroup.error);
          }
        }
        else
        {
          res.status(500).send("You can't put this id on this group"); 
        }
      }
      else
      {
        res.status(404).send("id of this group doesn't exist");
      }
    }
    catch (error) {
      res.status(500).send("An error has been occured during the editing.");
    }
  });

  groupRouter.get('/delete/:id', async (req: Request, res) => {
    try {    
      const id = req.params.id;
      if(await verifId(id))
      {  
        const childIds = await getChilds(id);
        childIds.push(id);
        
        deleteGroup(childIds);
        res.send("The groups has been successfully deleted");
      }
      else
      {
        res.status(404).send("id of this group doesn't exist");
      }
    }
    catch (error) {
      res.status(500).send("An error has been occured during the deleting.");
    }
  });

export default groupRouter
