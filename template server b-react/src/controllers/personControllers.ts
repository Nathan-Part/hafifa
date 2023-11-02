import { PersonInGroupModel, PersonModel } from "../schemas/models";
import personSchema from "../schemas/personSchema";
import { PersonInterface } from "../types";

export const getUsers = async () => 
{
    return await PersonModel.find({});
}

export const addUser = async(data: PersonInterface) =>
{
    return new PersonModel(data).save();
}

export const editUser = async(id: string, data: PersonInterface ) => 
{
    await PersonModel.updateOne(
        { _id: id },
        data
      );
}

export const deleteUser = async(id: string) => 
{
    await PersonModel.deleteOne({ _id: id });
    await PersonInGroupModel.deleteMany({personId: id});
}

export function validateObj(obj: PersonInterface) 
{  
  const newKeys = Object.keys(obj); // all properties of the new object
  const correctKeys = Object.keys(personSchema.obj); // all properties of the schema
  
  const obligatoryKeys = Object.keys(personSchema.obj).filter((key) => (personSchema.obj as any)[key].required);
  const missing = obligatoryKeys.filter((key) => !newKeys.includes(key)); // check if all property obligatory is here
  console.log(newKeys, correctKeys, obligatoryKeys, missing);
  if(missing.length === 0)
  {
    const getExtraFields = newKeys.filter(key => !correctKeys.includes(key));
    
    for (const property of getExtraFields) {
        delete (obj as any)[property];
    }
    console.log(getExtraFields, obj);
    
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

export const verifId = async(id: string) => 
{
    const countLetter = id.length;
    if(countLetter == 24)
    {
        console.log("count", countLetter);
        const verifId = await PersonModel.findById(id);
        console.log("verifid", verifId);
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