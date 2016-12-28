import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

const User = mongoose.model('User', userSchema);

export default User;
