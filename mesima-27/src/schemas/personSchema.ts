import mongoose from 'mongoose'
import { PersonInterface } from '../types';

const personSchema = new mongoose.Schema<PersonInterface>({
  name: {
    type: String,
    required: true,
  }
}, { collection: 'persons' });

export default personSchema