import { ObjectId } from "mongodb";
import { GroupModel, PersonInGroupModel, PersonModel } from "../schemas/models";
import { GroupInterface, PersonInGroupInterface } from "../types";
import { object } from "zod";
import { group } from "console";

export const findGroupById = async(id: string) => 
{
    return await PersonInGroupModel.find({personId: id});
}

export const getGroupsDetails = async(groupsOfUser: PersonInGroupInterface[]) => 
{
    const hisGroups: GroupInterface[] = [];
    for (let i = 0; i < groupsOfUser.length; i++) 
    {
        const hisGroup = await GroupModel.findById(groupsOfUser[i].groupId);
        if(hisGroup)
        {
            hisGroups.push(hisGroup);
        }
        
    }
    return hisGroups;
}

export const addUserInGroup = async(personId: ObjectId, groupId: ObjectId) => 
{
    return new PersonInGroupModel({ personId: personId,  groupId: groupId }).save();
}

export const checkIfExist = async(personId: ObjectId, groupId: ObjectId) => 
{
    const countLetter = groupId.toString().length;
    if(countLetter == 24)
    {
        const verifGroup = await GroupModel.findById(groupId);
        if(verifGroup)
        {
            const verif = await PersonInGroupModel.find({personId: personId,  groupId: groupId });
            if(verif.length == 0)
            {
                return true;
            }
            else
            {
                return {
                    isValide: false,
                    error: "You can't put the same group twice to this user"
                } 
            }
        }
        else
        {
            return {
                isValide: false,
                error: "id of the group doesn't exist"
            }
        }
    }
    else
    {
        return {
            isValide: false,
            error: "ahi ein matsav che ze objectId"
        }
    }
}