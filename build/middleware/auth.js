'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const auth = (req, res, next) => {
  let token = req.header('x-auth');
  // console.log('Requested with token:',token)
  _user2.default.findByToken(token).then(user => {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch(e => {
    let err = new Error('Needs authorization');
    err.status = 401;
    return next(err);
  });
};

exports.default = auth;