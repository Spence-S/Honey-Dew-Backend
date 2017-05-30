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


var router = _express2.default.Router();

// POST /users creates a new user
// this is the primary signup route
// eventually FB signup will be enabled per
// the FB routes
router.post('/', function (req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;

  var user = new _user2.default({ password: password });
  user.email.push({ email: email });
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
// just returns the current user information
router.get('/me', _auth2.default, function (req, res, next) {
  res.send(req.user);
});

//POST /users/login
// only way of loggin in currently
// will TODO: expand for fb later
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

router.put('/', _auth2.default, function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

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
            _context.next = 8;
            return req.user.save();

          case 8:
            _context.next = 14;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);
            return _context.abrupt('return', next(_context.t0));

          case 14:
            res.send(req.user);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 10]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

// removes token from user document
// maybe identify device type??
router.get('/logout', _auth2.default, function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, next) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return req.user.removeToken(req.token);

          case 3:
            _context2.next = 8;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', next(_context2.t0));

          case 8:
            res.send('Successfully logged out! See you soon.');

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 5]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());

// routes for user registration and signin with facebook
//router.use('/', facebook);

exports.default = router;