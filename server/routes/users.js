import express from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import User from '../models/user';
import auth from '../middleware/auth';
import axios from 'axios';
import facebook from './facebook';



const router = express.Router();


// POST /users creates a new user
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

router.get('/logout', auth, async (req, res, next) => {
  await req.user.removeToken(req.token);
  res.send('Successfully logged out! See you soon.')
})

// routes for user registration and signin with facebook
router.use('/', facebook);

export default router;
