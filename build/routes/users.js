'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongodb = require('mongodb');

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _auth = require('../middleware/auth');

var _auth2 = _interopRequireDefault(_auth);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//import facebook from './facebook';


const router = _express2.default.Router();

// POST /users creates a new user
// this is the primary signup route
// eventually FB signup will be enabled per
// the FB routes
router.post('/', (req, res, next) => {
  let { email, password } = req.body;
  let user = new _user2.default({ password });
  user.email.push({ email });
  user.save().then(() => {
    // after the user is saved, a token is generated
    return user.generateAuthToken();
  }).then(token => {
    // token is passed and set as res header
    res.header('Access-Control-Expose-Headers', 'x-auth');
    res.header('x-auth', token).send(user);
  }).catch(err => {
    err.status = 400;
    return next(err);
  });
});

// GET /users/me
// just returns the current user information
router.get('/me', _auth2.default, (req, res, next) => {
  res.send(req.user);
});

//POST /users/login
// only way of loggin in currently
// will TODO: expand for fb later
router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  console.log('req.body', req.body);
  _user2.default.findByCredentials(email, password).then(user => {
    return user.generateAuthToken().then(token => {
      res.header('Access-Control-Expose-Headers', 'x-auth');
      res.header('x-auth', token).send(user);
    });
  }).catch(err => {
    return next(err);
  });
});

router.put('/', _auth2.default, (() => {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    try {
      if (req.body.firstName) req.user.firstName = req.body.firstName;
      if (req.body.lastName) req.user.lastName = req.body.lastName;
      if (req.body.username) req.user.username = req.body.username;
      if (req.body.picture) req.user.image.url = req.body.picture;
      if (req.body.facebook) {
        req.user.accounts.push({
          facebook: {
            name: req.body.facebook.name,
            email: req.body.facebook.email,
            uid: req.body.facebook.userID
          }
        });
      }
      yield req.user.save();
    } catch (err) {
      console.log(err);
      err.status = 400;
      return next(err);
    }
    res.send(req.user);
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})());

// removes token from user document
// maybe identify device type??
router.get('/logout', _auth2.default, (() => {
  var _ref2 = _asyncToGenerator(function* (req, res, next) {
    try {
      yield req.user.removeToken(req.token);
    } catch (err) {
      return next(err);
    }
    res.send('Successfully logged out! See you soon.');
  });

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
})()

// routes for user registration and signin with facebook
//router.use('/', facebook);

);exports.default = router;