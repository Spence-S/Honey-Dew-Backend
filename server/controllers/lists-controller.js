import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import List from '../models/list';
import NewTodo from '../models/new_todos';

// create a new list
// POST /api/lists
export const createNewList = async (req, res, next) => {
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
};

// create a new todo for a particular listId
// POST /lists/:listId
export const createNewTodo = async (req, res, next) => {
  const { text } = req.body;
  const { listId } = req.params;
  const ownerId = req.user._id;
  const todo = new NewTodo({
    text,
    listId,
    ownerId
  });
  try {
    const newTodo = await todo.save();
    const list = await List.findByIdAndUpdate(
      listId,
      { $push: { todoIds: newTodo._id } },
      { new: true }
    );
    res.send({ newTodo, list });
  } catch (err) {
    next(err);
  }
};

// get all lists for a user
// GET /lists
export const returnAllLists = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const lists = await List.find({ ownerId: _id });
    res.send(lists);
  } catch (err) {
    next(err);
  }
};

// get all todos for a list
// GET /lists/:listId
export const returnListItems = async (req, res, next) => {
  const { listId } = req.params;
  const list = await NewTodo.find({ listId });
  res.send({ todos: list });
};

// delete an entire list and all todos
// DELETE /lists/:listId
export const deleteList = async (req, res, next) => {
  const { listId } = req.params;
  try {
    await NewTodo.remove({ listId });
    await List.findByIdAndRemove(listId);
    res.send('success!');
  } catch (err) {
    next(err);
  }
};

export const deleteListItem = async (req, res, next) => {
  if (!ObjectID.isValid(req.params.listItemId)) {
    let err = new Error('ObjectID invalid');
    err.status = 400;
    console.log(err);
    return next(err);
  }

  try {
    const newTodo = await NewTodo.findOneAndRemove({
      _id: req.params.listItemId,
      ownerId: req.user.id
    });

    const list = await List.findByIdAndUpdate(
      req.params.listId,
      { $pull: { todoIds: req.params.listItemId } },
      { new: true }
    );

    res.send({ newTodo, list });
  } catch (err) {
    next(err);
  }
};

// PUT /lists/listitem/:id
// updates the desired list item
const updateListItem = async (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    let err = new Error('ObjectID invalid');
    err.status = 400;
    console.log(err);
    return next(err);
  }
  NewTodo.findOneAndUpdate(
    {
      _id: req.params.id,
      ownerId: req.user._id
    },
    req.body,
    { new: true, runValidators: true }
  )
    .then(doc => {
      res.send(doc);
    })
    .catch(err => {
      err.status = 400;
      return next(err);
    });
};
