import { ObjectId } from 'mongoose'

// Interface //
interface PersonInterface {
    name: string
  }
  
  interface GroupInterface {
    name: string
    groupFather?: ObjectId
    groups?: GroupInterface[];
  }
  
  interface PersonInGroupInterface {
    personId: ObjectId,
    groupId: ObjectId
  }

  export {
    PersonInterface,
    GroupInterface,
    PersonInGroupInterface
  };