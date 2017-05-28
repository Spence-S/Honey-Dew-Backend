import express from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import User from '../models/user';
import auth from '../middleware/auth';
import axios from 'axios';
// import { Facebook, FacebookApiException } from 'fb';

const router = express.Router();


// POST /users creates a new user
router.post('/', (req, res, next) => {
  let { email, password } = req.body;
  let user = new User({email, password});
  console.log('req.body', req.body);
  console.log('user', user);
  user.save()
    .then( () => {
      // after the user is saved, a token is generated
      return user.generateAuthToken();
    })
    .then( token => {
      // token is passed and set as res header
      res.header('Access-Control-Expose-Headers', 'x-auth');
      res.header('x-auth', token).send(user);
    })
    .catch( err => {
      err.status = 400;
      return next(err);
    });
});

// GET /users/me
router.get('/me', auth, (req, res, next) => {
  res.send(req.user);
});

//POST /users/login
router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  console.log('req.body', req.body);
  User.findByCredentials(email, password)
    .then( user => {
      return user.generateAuthToken()
        .then( token => {
          res.header('Access-Control-Expose-Headers', 'x-auth');
          res.header('x-auth', token).send(user);
        });
    })
    .catch( e => {
      let err = new Error('problem logging in');
      err.status = 400;
      return next(err);
    });
});


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
  User.findOne({email: facebook.email })
    .then(user => {
      // if user exists
      if (user) {
        // and if no facebook account
        if (!user.facebook) {
          user.facebook = facebook;
          // update account and save
          user.save()
            .then( () => {
              // after the user is saved, a token is generated
              return user.generateAuthToken();
            })
            .then( token => {
              // token is passed and set as res header
              res.header('Access-Control-Expose-Headers', 'x-auth');
              res.header('x-auth', token).send(user);
            })
            .catch( err => {
              err.status = 400;
              return next(err);
            });
            // else fb is there, just send token for Todos
        } else {
          return user.generateAuthToken()
          .then( token => {
            // token is passed and set as res header
            res.header('Access-Control-Expose-Headers', 'x-auth');
            res.header('x-auth', token).send(user);
          })
          .catch( err => {
            err.status = 400;
            return next(err);
          });
        }
        // or if there is no user found
      } else {
        //create user from facebook details with no password
        let newuser = new User({email: facebook.email, facebook });
        newuser.save()
          .then( () => {
            // after the user is saved, a token is generated
            return newuser.generateAuthToken();
          })
          .then( token => {
            // token is passed and set as res header
            res.header('Access-Control-Expose-Headers', 'x-auth');
            res.header('x-auth', token).send(user);
          })
          .catch( err => {
            err.status = 400;
            return next(err);
          });
        }
    })
})


// new route with async await
// fixed fucntionality verifies token with fb before
// storage and assigns JWT to user from FB
// TODO fix model to use FB values as defaults and
// over ride with user submitted values
router.post('/facebook/signup', async (req, res, next) => {
  return res.send('Please use regular signup or login above until FB login/signup is complete!');
  const facebook = req.body;
  // after getting facebook information we need to verify the information with
  // facebook, make sure it hasn't been f***d with
  // https://stackoverflow.com/questions/8605703/how-to-verify-facebook-access-token
  // GET graph.facebook.com/debug_token?
    // input_token={token-to-inspect}
    // &access_token={app_id}|{app_secret}
  const verify = await axios.get(`https://graph.facebook.com/debug_token?input_token=${facebook.accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`)
  // pull off the important part of the repsonse
  // does it pass validation?
  // console.log(verify.data.data)
  if (verify.data.data.app_id == process.env.FACEBOOK_APP_ID && verify.data.data.application === 'Honey Dew' && verify.data.data.is_valid) {
    try{
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
    let fbToken = await axios.get(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${facebook.accessToken}`)
    fbToken = fbToken.data;
    // then sign up the user.
    // TODO sanitize this a bit before saving
      let newuser = new User({email: facebook.email, facebook, fbToken });
      newuser = await newuser.save();
      // generate a token
      let token = await newuser.generateAuthToken();
      // send the token back
      res.header('Access-Control-Expose-Headers', 'x-auth');
      res.header('x-auth', token).send(newuser);
    } catch(err) {
      console.log(err);
      return next(err);
    }
  } else {
    // handle facebook validation errors
    console.log('did not pass verify');
    let err = new Error('Could not validate facebook information');
    err.status = 401;
    return next(err)
  }
});

export default router;
