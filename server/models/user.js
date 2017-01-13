import mongoose, { Schema } from 'mongoose';
import { isEmail } from 'validator';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
let jwt = jsonwebtoken;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: isEmail,
      message:'{VALUE} is not a valid e-mail'
    },
    lowerCase: true
  },
  password:{
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.statics.findByToken = function (token){
  let User = this;
  let decoded;
  try{
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
      return  Promise.reject();
  }
  return User.findOne({
    '_id': decoded,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  let { _id, email } = userObject;
  return { _id, email };
};

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens.push({
    access,
    token
  });
  return user.save().then( () => {
    return token;
  });
};

UserSchema.pre('save', function(next){
  let user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            // Store hash in your password DB.
            user.password = hash;
            next();
        });
    });
  }else{
    next();
  }
});

const User = mongoose.model('User', UserSchema);

export default User;
