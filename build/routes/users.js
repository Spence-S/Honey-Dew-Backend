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

var _facebook = require('./facebook');

var _facebook2 = _interopRequireDefault(_facebook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

router.get('/logout', _auth2.default, function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return req.user.removeToken(req.token);

          case 2:
            res.send('Successfully logged out! See you soon.');

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

// routes for user registration and signin with facebook
router.use('/', _facebook2.default);

exports.default = router;