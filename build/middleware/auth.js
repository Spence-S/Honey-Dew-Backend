'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = function auth(req, res, next) {
  var token = req.header('x-auth');
  // console.log('Requested with token:',token)
  _user2.default.findByToken(token).then(function (user) {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch(function (e) {
    var err = new Error('Needs authorization');
    err.status = 401;
    return next(err);
  });
};

exports.default = auth;