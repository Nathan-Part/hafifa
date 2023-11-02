import { Schema } from 'mongoose'
import { PersonInGroupInterface } from '../types';

var personInGroupSchema = new Schema<PersonInGroupInterface>({
  personId : { 
    type: Schema.Types.ObjectId,
    ref: 'Person' 
  },
  groupId  : { 
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }
});

export default personInGroupSchema