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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// POST /users creates a new user
router.post('/', function (req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;

  var user = new _user2.default({ email: email, password: password });
  console.log('req.body', req.body);
  console.log('user', user);
  user.save().then(function () {
    // after the user is saved, a token is generated
    return user.generateAuthToken();
  }).then(function (token) {
    // token is passed and set as res header
    res.header('Access-Control-Expose-Headers', 'x-auth');
    res.header('x-auth', token).send(user);
  }).catch(function (err) {
    err.status = 400;
    return next(err);
  });
});

// GET /users/me
router.get('/me', _auth2.default, function (req, res, next) {
  res.send(req.user);
});

//POST /users/login
router.post('/login', function (req, res, next) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;

  console.log('req.body', req.body);
  _user2.default.findByCredentials(email, password).then(function (user) {
    return user.generateAuthToken().then(function (token) {
      res.header('Access-Control-Expose-Headers', 'x-auth');
      res.header('x-auth', token).send(user);
    });
  }).catch(function (e) {
    var err = new Error('problem logging in');
    err.status = 400;
    return next(err);
  });
});

exports.default = router;