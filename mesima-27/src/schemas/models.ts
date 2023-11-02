import mongoose from 'mongoose'

//schema 
import groupSchema from './groupSchema';
import personSchema from './personSchema';
import personInGroupSchema from './personInGroupSchema';

// Model
const GroupModel = mongoose.model('Group', groupSchema);

const PersonModel = mongoose.model('Person', personSchema);

var PersonInGroupModel = mongoose.model('Ingroup', personInGroupSchema);

export {
    GroupModel,
    PersonModel,
    PersonInGroupModel
}