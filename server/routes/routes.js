/********************************
Import all dependencies for routing
this is the routing for API
which is just a simple "todo" app
**********************************/
import express from 'express';
import mongoose from 'mongoose';
import Todo from '../models/todo';

const router = express.Router();

/*****************************
GET /api returns all todos
At some point in the future they will
be ensured to be returned in chronological
order of when they were made
******************************/
router.get('/', (req, res, next) => {
  Todo.find({})
    .then((doc) => {
      console.log(doc);
      res.send(doc);
    })
    .catch((err) => {
      return next(err);
    });
});

/*****************************
POST /api adds a todo to Database
Simple enough ;)
******************************/
router.post('/', (req, res, next) => {
  let todo = new Todo(req.body);
  todo.save()
    .then((doc) => {
      console.log(doc);
      res.send(doc);
    })
    .catch((err) => {
      err.status = 400;
      return next(err);
    });
});


export default router;
