import mongoose, { Schema } from 'mongoose';

let todoSchema = new Schema({
  text: {
    type: String ,
    required: true,
    trim: true,
    minlength: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  notes:{
    type: String,
    default: 'Todo notes are not enabled yet, but they are coming soon!'
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
  }
});

const Todo = mongoose.model('Todo' , todoSchema);

export default Todo;
