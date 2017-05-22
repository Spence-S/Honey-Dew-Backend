import express from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import User from '../models/user';
import auth from '../middleware/auth';
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

// POST /users/facebook
// creates or signs in a new user with a fb account
router.post('/facebook', (req, res, next) => {
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
        let user = new User({email: facebook.email, facebook });
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
        }
    })
})

export default router;
