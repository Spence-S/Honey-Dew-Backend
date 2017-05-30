'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = require('validator');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = _jsonwebtoken2.default;

var UserSchema = new _mongoose2.default.Schema({
  email: [{
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: _validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    isVerified: {
      type: Boolean,
      reuired: true,
      default: false
    }
  }],
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    trim: true
  },
  image: {
    url: {
      type: String,
      trim: true
    },
    file: {
      type: String,
      data: Buffer
    }
  },
  phone: {
    type: Number,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  accounts: [{
    facebook: {
      name: String,
      email: String,
      uid: String,
      token: [{
        token: String,
        expiresIn: Number
      }]
    }
  }],
  // TODO at some point I want to get
  // a device type associated with each token
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

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _lodash2.default.pick(userObject, ['_id', 'email', 'firstName', 'lastName', 'username', 'image', 'accounts']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access: access }, process.env.JWT_SECRET || 'coolcat').toString();

  user.tokens.push({ access: access, token: token });

  return user.save().then(function () {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: { token: token }
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'coolcat');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({ 'email.email': email }).then(function (user) {
    if (!user) {
      return Promise.reject();
    }

    return new Promise(function (resolve, reject) {
      // Use bcrypt.compare to compare password and user.password
      _bcryptjs2.default.compare(password, user.password, function (err, res) {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    _bcryptjs2.default.genSalt(10, function (err, salt) {
      _bcryptjs2.default.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = _mongoose2.default.model('User', UserSchema);

exports.default = User;