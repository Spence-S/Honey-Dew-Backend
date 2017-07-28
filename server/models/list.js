// currently under development

import mongoose, { Schema } from 'mongoose';

let ListSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  todoIds: [Schema.Types.ObjectId],
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const List = mongoose.model('List', ListSchema);

export default List;
