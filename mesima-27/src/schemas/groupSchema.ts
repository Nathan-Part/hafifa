import mongoose, { Schema } from 'mongoose'
import { GroupInterface } from '../types';

const groupSchema = new mongoose.Schema<GroupInterface>({
    name:{
      type: String,
      required: true,
    },
    groupFather: {
      type: mongoose.Types.ObjectId,
      ref: 'GroupInterface'
    },
    groups: {
      type: Schema.Types.Mixed, // the type mixed is for specified a type array of object
      ref: 'GroupInterface'
    },
    persons: {
      type: Schema.Types.Mixed, // the type mixed is for specified a type array of object
      ref: 'PersonInterface'
    }
  });

export default groupSchema
