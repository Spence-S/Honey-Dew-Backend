import express from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import User from '../models/user';
import auth from '../middleware/auth';
import axios from 'axios';
//import facebook from './facebook';



const router = express.Router();


// POST /users creates a new user
// this is the primary signup route
// eventually FB signup will be enabled per
// the FB routes
router.post('/', (req, res, next) => {
  let { email, password } = req.body;
  let user = new User({password});
  user.email.push({email});
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
// just returns the current user information
router.get('/me', auth, (req, res, next) => {
  res.send(req.user);
});

//POST /users/login
// only way of loggin in currently
// will TODO: expand for fb later
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

router.put('/', auth, async (req, res, next) => {
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
          uid: req.body.facebook.userID,
        }
      });
    }
    await  req.user.save();
  } catch(err){
      console.log(err);
      return next(err)
  }
  res.send(req.user);
});

// removes token from user document
// maybe identify device type??
router.get('/logout', auth, async (req, res, next) => {
  try {
    await req.user.removeToken(req.token);
  } catch (err) {
    return next(err);
  }
  res.send('Successfully logged out! See you soon.')
})

// routes for user registration and signin with facebook
//router.use('/', facebook);

export default router;
