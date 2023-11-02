import mongoose, { Schema } from "mongoose";
import { GroupModel, PersonInGroupModel } from "../schemas/models";
import { GroupInterface, PersonInterface } from "../types";
import groupSchema from "../schemas/groupSchema";

export const getGroups = async () => 
{
    return await GroupModel.find();
}

export const addGroup = async (data: GroupInterface) => {
  try {
    const group = new GroupModel(data);
    const savedGroup = await group.save();
    return savedGroup;
  } 
  catch (error: any) {
    console.log(error.errors.name.properties.message);
  }
};

export function validateGroup(obj: GroupInterface) 
{  
  const newKeys = Object.keys(obj); // all properties of the new object
  const correctKeys = Object.keys(groupSchema.obj); // all properties of the schema

  const obligatoryKeys = Object.keys(groupSchema.obj).filter((key) => (groupSchema.obj as any)[key].required);
  const missing = obligatoryKeys.filter((key) => !newKeys.includes(key)); // check if all property obligatory is here
  if(missing.length === 0)
  {
    const getExtraFields = newKeys.filter(key => !correctKeys.includes(key));
    for (let i = 0; i < getExtraFields.length; i++) {
      delete obj[getExtraFields[i] as keyof GroupInterface];
    }
    return {
      isValide: true,
      object: obj
    }
  }
  else
  {
    const error = "you have not completed the field: " + missing.join(', ');
    return {
      isValide: false,
      error: error,
      object: obj
    }
  }
}

export const editGroup = async(id: string, data: GroupInterface) => 
{
  await GroupModel.updateOne(
      { _id: id },
      data
    );
}

export const deleteGroup = async(childIds: string[]) => 
{
    for (let i = 0; i < childIds.length; i++) 
    {
      await GroupModel.deleteOne({ _id: childIds[i] });        
      await PersonInGroupModel.deleteMany({groupId: childIds[i]})
    }
}

export const getMergedChildGroups = async(id: string) => 
{
    const parent = await GroupModel.findById(id);
    if (!parent) {
      return {} as GroupInterface
    }
    const children = await GroupModel.find({ groupFather: id });
    for await (const child of children) {
      parent.set({ groups: [...parent?.groups || [], await getMergedChildGroups(child._id.toString())]});
    }
    return parent
}

export const getGroupByName = async(name: string) => 
{
    return await GroupModel.find({name: name});
}

export async function getChilds(groupId: string) {
    const childIds: string[] = [];

    const groups = await GroupModel.find({ groupFather: groupId });
    for (const group of groups) {
      childIds.push(group._id.toString());
      const grandchildrenIds = await getChilds(group._id.toString());
      if(grandchildrenIds.length !== 0)
      {
        childIds.push(...grandchildrenIds);
      }
    }
    
    return childIds;
  }

  export const verifId = async(id: string) => 
  {
      const countLetter = id.length;
      if(countLetter == 24)
      {
          const verifId = await GroupModel.findById(id);
          console.log(verifId);
          if(verifId)
          {
            return true;
          }
          else
          {
            return false;
          }
      }
      else
      {
        return false;
      }
  }