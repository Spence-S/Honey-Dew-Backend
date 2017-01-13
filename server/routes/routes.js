/********************************
Import all dependencies for routing
this is the routing for API
which is just a simple "todo" app
**********************************/
import express from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb'
import Todo from '../models/todo';
/******Set up the router******/
const router = express.Router();
/*****************************
GET /api returns all todos
At some point in the future they will
be ensured to be returned in chronological
order of when they were made
******************************/
router.get('/', (req, res, next) => {
  Todo.find({})
    .then( (todos) => {
      res.send({
        todos
      });
    })
    .catch( (err) => {
      return next(err);
    });
});
/*******************************
GET /:id will return an individual todo item
and all its saved details
********************************/
router.get('/:id', (req, res, next) => {

  if(!ObjectID.isValid(req.params.id)){
    let err = new Error('ObjectID invalid');
    err.status = 400;
    return next(err);
  }

  Todo.findOne({ _id: req.params.id })
    .then( (todo) => {
      if(!todo){
        let err = new Error;
        err.status = 404,
        err.message = "Todo item was not found"
        return next(err);
      }
      res.send(todo);
    })
    .catch( (err) => {
      err.status = 400;
      return next(err);
    });
})
/*****************************
POST /api adds a todo to Database
Simple enough ;)
******************************/
router.post('/', (req, res, next) => {
  let todo = new Todo(req.body);
  todo.save()
    .then( (doc) => {
      res.send(doc);
    })
    .catch( (err) => {
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

  if(!ObjectID.isValid(req.params.id)){
    let err = new Error('ObjectID invalid');
    err.status = 400;
    console.log(err);
    return next(err);
  }

  Todo.findByIdAndRemove(req.params.id)
    .then( todo => {
      if(returnDeleted){
        res.send(todo);
      }else{
        Todo.find({})
          .then( todos => {
            res.send(todos);
          })
          .catch( err => {
            err.status = 400;
            return next(err);
          });
      }
    })
    .catch( err => {
      err.status = 400;
      return next(err);
    });
});
/*******************************
PUT route to update some shit
******************************/
router.put('/:id', (req, res, next) => {
  if(!ObjectID.isValid(req.params.id)){
    let err = new Error('ObjectID invalid');
    err.status = 400;
    console.log(err);
    return next(err);
  }
  Todo.findByIdAndUpdate(req.params.id, req.body,
    { new: true, runValidators : true,})
    .then( doc => {
      res.send(doc);
    })
    .catch( err => {
      err.status = 400;
      return next(err);
    });
});
/*Export the router as a module*/
export default router;
