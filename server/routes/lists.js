/********************************
Import all dependencies for routing
this is the routing for API
which is just a simple "todo" app
**********************************/
import express from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import List from '../models/list';
import NewTodo from '../models/new_todos';
import auth from '../middleware/auth';

const router = express.Router();

//protect all routes
router.use(auth);

// create a new list
// POST /api/lists
router.post('/', async (req, res, next) => {
  // user id
  const { _id } = req.user;
  // Just needs a list name
  console.log(req.body);
  const { name } = req.body;

  const list = new List({
    name,
    ownerId: _id
  });
  try {
    const listDoc = await list.save();
    res.send(listDoc);
  } catch (err) {
    next(err);
  }
});

// create a new todo for a particular listId
// POST /api/lists/:listId
router.post('/:listId', async (req, res, next) => {
  const { text } = req.body;
  const { listId } = req.params;
  const ownerId = req.user._id;
  // Just needs a list name

  const todo = new NewTodo({
    text,
    listId,
    ownerId
  });
  try {
    const newTodo = await todo.save();
    const list = await List.findByIdAndUpdate(
      listId,
      { $push: { todoIds: { id: newTodo._id } } },
      { new: true }
    );
    res.send({ newTodo, list });
  } catch (err) {
    next(err);
  }
});

// get all lists for a user
// GET /lists
router.get('/', async (req, res, next) => {
  const { _id } = req.user;
  try {
    const lists = await List.find({ ownerId: _id });
    res.send(lists);
  } catch (err) {
    next(err);
  }
});

router.get('/:listId', async (req, res, next) => {
  const { listId } = req.params;
  const list = await NewTodo.find({ listId });
  res.send({ todos: list });
});

/*Export the router as a module*/
export default router;
