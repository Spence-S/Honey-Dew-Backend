'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongodb = require('mongodb');

var _todo = require('../models/todo');

var _todo2 = _interopRequireDefault(_todo);

var _auth = require('../middleware/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******Set up the router******/
const router = _express2.default.Router();
//protect all routes
/********************************
Import all dependencies for routing
this is the routing for API
which is just a simple "todo" app
**********************************/
router.use(_auth2.default);

/*****************************
GET /api returns all todos
At some point in the future they will
be ensured to be returned in chronological
order of when they were made
******************************/
router.get('/', (req, res, next) => {
  _todo2.default.find({
    ownerId: req.user._id
  }).then(todos => {
    res.send({
      todos
    });
  }).catch(err => {
    return next(err);
  });
});

/*******************************
GET /:id will return an individual todo item
and all its saved details
********************************/
router.get('/:id', (req, res, next) => {

  if (!_mongodb.ObjectID.isValid(req.params.id)) {
    let err = new Error('ObjectID invalid');
    err.status = 400;
    return next(err);
  }

  _todo2.default.findOne({
    _id: req.params.id,
    ownerId: req.user._id
  }).then(todo => {
    if (!todo) {
      let err = new Error();
      err.status = 404, err.message = "Todo item was not found";
      return next(err);
    }
    res.send(todo);
  }).catch(err => {
    err.status = 400;
    return next(err);
  });
}

/*****************************
POST /api adds a todo to Database
Simple enough ;)
******************************/
);router.post('/', (req, res, next) => {
  let todo = new _todo2.default({
    text: req.body.text,
    ownerId: req.user._id
  });
  todo.save().then(doc => {
    res.send(doc);
  }).catch(err => {
    let error = new Error();
    error.message = 'there were no todos!';
    err.status = 400;
    return next(err);
  });
});

/*****************************
DELETE /api/:id removes the todo
with id param and returns the new
list of todos with the removed todo
*******************************/
router.delete('/:id', (req, res, next) => {
  let returnDeleted = true;

  if (!_mongodb.ObjectID.isValid(req.params.id)) {
    let err = new Error('ObjectID invalid');
    err.status = 400;
    console.log(err);
    return next(err);
  }

  _todo2.default.findOneAndRemove({
    _id: req.params.id,
    ownerId: req.user.id
  }).then(todo => {
    if (returnDeleted) {
      res.send(todo);
    } else {
      _todo2.default.find({}).then(todos => {
        res.send(todos);
      }).catch(err => {
        err.status = 400;
        return next(err);
      });
    }
  }).catch(err => {
    err.status = 400;
    return next(err);
  });
});

/*******************************
PUT route to update some shit
******************************/
router.put('/:id', (req, res, next) => {
  if (!_mongodb.ObjectID.isValid(req.params.id)) {
    let err = new Error('ObjectID invalid');
    err.status = 400;
    console.log(err);
    return next(err);
  }
  _todo2.default.findOneAndUpdate({
    _id: req.params.id,
    ownerId: req.user._id
  }, req.body, { new: true, runValidators: true }).then(doc => {
    res.send(doc);
  }).catch(err => {
    err.status = 400;
    return next(err);
  });
});

/*Export the router as a module*/
exports.default = router;