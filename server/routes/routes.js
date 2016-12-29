/********************************
Import all dependencies for routing
this is the routing for API
which is just a simple "todo" app
**********************************/
import express from 'express';
import mongoose from 'mongoose';
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
      console.log(todos);
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
      console.log(doc);
      res.send(doc);
    })
    .catch( (err) => {
      err.status = 400;
      return next(err);
    });
});
/*Export the router as a module*/
export default router;
