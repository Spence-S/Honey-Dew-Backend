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

const router = _express2.default.Router();
/*
https://developers.facebook.com/docs/facebook-login/access-tokens/expiration-and-extension
https://developers.facebook.com/docs/facebook-login/access-tokens/portability

per the above link, we will go the simplest route of storing a long term token
and send that to the client for all request. In the future may proxy all requests
for enhanced security.

https://developers.facebook.com/docs/facebook-login/security#tokenhijacking

per this, we need to use debug endpoints for guarantee token is from our app
https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#checktoken
*/

// POST /users/facebook
// creates or signs in a new user with a fb account
router.post('/facebook', (req, res, next) => {
  return res.send('Please use regular signup or login above until FB login/signup is complete!');
  let facebook = req.body;
  console.log('req.body', req.body);
  _user2.default.findOne({ email: facebook.email }).then(user => {
    // if user exists
    if (user) {
      // and if no facebook account
      if (!user.facebook) {
        user.facebook = facebook;
        // update account and save
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
        // else fb is there, just send token for Todos
      } else {
        return user.generateAuthToken().then(token => {
          // token is passed and set as res header
          res.header('Access-Control-Expose-Headers', 'x-auth');
          res.header('x-auth', token).send(user);
        }).catch(err => {
          err.status = 400;
          return next(err);
        });
      }
      // or if there is no user found
    } else {
      //create user from facebook details with no password
      let newuser = new _user2.default({ email: facebook.email, facebook });
      newuser.save().then(() => {
        // after the user is saved, a token is generated
        return newuser.generateAuthToken();
      }).then(token => {
        // token is passed and set as res header
        res.header('Access-Control-Expose-Headers', 'x-auth');
        res.header('x-auth', token).send(user);
      }).catch(err => {
        err.status = 400;
        return next(err);
      });
    }
  });
}

// new route with async await
// fixed fucntionality verifies token with fb before
// storage and assigns JWT to user from FB
// TODO fix model to use FB values as defaults and
// over ride with user submitted values
);router.post('/facebook/signup', (() => {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    return res.send('Please use regular signup or login above until FB login/signup is complete!');
    const facebook = req.body;
    // after getting facebook information we need to verify the information with
    // facebook, make sure it hasn't been f***d with
    // https://stackoverflow.com/questions/8605703/how-to-verify-facebook-access-token
    // GET graph.facebook.com/debug_token?
    // input_token={token-to-inspect}
    // &access_token={app_id}|{app_secret}
    const verify = yield _axios2.default.get(`https://graph.facebook.com/debug_token?input_token=${facebook.accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`
    // pull off the important part of the repsonse
    // does it pass validation?
    // console.log(verify.data.data)
    );if (verify.data.data.app_id == process.env.FACEBOOK_APP_ID && verify.data.data.application === 'Honey Dew' && verify.data.data.is_valid) {
      try {
        //if validation passes
        console.log('pass verify');
        // get longterm facebook token
        // https://developers.facebook.com/docs/facebook-login/access-tokens/expiration-and-extension
        //
        // GET /oauth/access_token?
        //  grant_type=fb_exchange_token&amp;
        //  client_id={app-id}&amp;
        //  client_secret={app-secret}&amp;
        //  fb_exchange_token={short-lived-token}
        let fbToken = yield _axios2.default.get(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${facebook.accessToken}`);
        fbToken = fbToken.data;
        // then sign up the user.
        // TODO sanitize this a bit before saving
        let newuser = new _user2.default({ email: facebook.email, facebook, fbToken });
        newuser = yield newuser.save();
        // generate a token
        let token = yield newuser.generateAuthToken();
        // send the token back
        res.header('Access-Control-Expose-Headers', 'x-auth');
        res.header('x-auth', token).send(newuser);
      } catch (err) {
        console.log(err);
        return next(err);
      }
    } else {
      // handle facebook validation errors
      console.log('did not pass verify');
      let err = new Error('Could not validate facebook information');
      err.status = 401;
      return next(err);
    }
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})());

exports.default = router;