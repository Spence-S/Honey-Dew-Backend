import express from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import User from '../models/user';
const router = express.Router();


// POST /users creates a new user
router.post('/', (req,res,next) => {
  let { email, password } = req.body;
  let user = new User({email, password});

  user.save()
    .then( () => {
      return user.generateAuthToken();
    })
    .then( token => {
      res.header('x-auth', token).send(user);
    })
    .catch( err => {
      err.status = 400;
      return next(err);
    });
});

// GET /users/me I dunno shit
router.get('/me', (req, res, next) => {
  let token = req.header('x-auth');
  User.findByToken(token)
    .then( user => {
      if(!user){
        return Promise.reject();
      }
      res.send(user);
    })
    .catch( e => {
      let err = new Error('Needs authorization');
      err.status = 401;
      return next(err);
    });
});

//POST /users/login
router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  User.findByCredentials(email, password)
    .then( user => {
      return user.generateAuthToken()
        .then( token => {
          res.header('x-auth', token).send(user);
        });
    })
    .catch( e => {
      let err = new Error('problem logging in');
      err.status = 400;
      return next(err);
    });
});



export default router;
