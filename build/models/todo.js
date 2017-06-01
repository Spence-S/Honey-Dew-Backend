'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let todoSchema = new _mongoose.Schema({
  text: {
    type: String,
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
  notes: {
    type: String,
    default: 'default string from Mongoose defaults!'
  },
  ownerId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Todo = _mongoose2.default.model('Todo', todoSchema);

exports.default = Todo;