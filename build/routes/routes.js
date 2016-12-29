'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _todo = require('../models/todo');

var _todo2 = _interopRequireDefault(_todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/******Set up the router******/
var router = _express2.default.Router();
/*****************************
GET /api returns all todos
At some point in the future they will
be ensured to be returned in chronological
order of when they were made
******************************/
/********************************
Import all dependencies for routing
this is the routing for API
which is just a simple "todo" app
**********************************/
router.get('/', function (req, res, next) {
  _todo2.default.find({}).then(function (todos) {
    console.log(todos);
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
  _todo2.default.findOne({ _id: req.params.id }).then(function (todo) {
    if (!todo) {
      var err = new Error();
      err.status = 404, err.message = "Todo item was not found";
      return next(err);
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
    console.log(doc);
    res.send(doc);
  }).catch(function (err) {
    err.status = 400;
    return next(err);
  });
});
/*Export the router as a module*/
exports.default = router;