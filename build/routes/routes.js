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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******Set up the router******/
/********************************
Import all dependencies for routing
this is the routing for API
which is just a simple "todo" app
**********************************/
var router = _express2.default.Router();
/*****************************
GET /api returns all todos
At some point in the future they will
be ensured to be returned in chronological
order of when they were made
******************************/
router.get('/', function (req, res, next) {
  _todo2.default.find({}).then(function (todos) {
    res.send({
      todos: todos
    });
  }).catch(function (err) {
    return next(err);
  });
});
/*******************************
GET /:id will return an individual todo item
and all its saved details
********************************/
router.get('/:id', function (req, res, next) {

  if (!_mongodb.ObjectID.isValid(req.params.id)) {
    var err = new Error('ObjectID invalid');
    err.status = 400;
    return next(err);
  }

  _todo2.default.findOne({ _id: req.params.id }).then(function (todo) {
    if (!todo) {
      var _err = new Error();
      _err.status = 404, _err.message = "Todo item was not found";
      return next(_err);
    }
    res.send(todo);
  }).catch(function (err) {
    err.status = 400;
    return next(err);
  });
});
/*****************************
POST /api adds a todo to Database
Simple enough ;)
******************************/
router.post('/', function (req, res, next) {
  var todo = new _todo2.default(req.body);
  todo.save().then(function (doc) {
    res.send(doc);
  }).catch(function (err) {
    err.status = 400;
    return next(err);
  });
});
/*****************************
DELETE /api/:id removes the todo
with id param and returns the new
list of todos with the removed todo
*******************************/
router.delete('/:id', function (req, res, next) {
  var returnDeleted = true;

  if (!_mongodb.ObjectID.isValid(req.params.id)) {
    var err = new Error('ObjectID invalid');
    err.status = 400;
    console.log(err);
    return next(err);
  }

  _todo2.default.findByIdAndRemove(req.params.id).then(function (todo) {
    if (returnDeleted) {
      res.send(todo);
    } else {
      _todo2.default.find({}).then(function (todos) {
        res.send(todos);
      }).catch(function (err) {
        err.status = 400;
        return next(err);
      });
    }
  }).catch(function (err) {
    err.status = 400;
    return next(err);
  });
});
/*Export the router as a module*/
exports.default = router;