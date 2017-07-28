/********************************
Import all dependencies for routing
this is the routing for API
which is just a simple "todo" app
**********************************/
import express from 'express';

import auth from '../middleware/auth';
import {
  createNewList,
  createNewTodo,
  returnAllLists,
  returnListItems,
  deleteList,
  deleteListItem,
  updateListItem
} from '../controllers';

const router = express.Router();

//protect all routes
router.use(auth);

router.post('/', createNewList);
router.post('/:listId', createNewTodo);
router.get('/', returnAllLists);
router.get('/:listId', returnListItems);
router.delete('/:listId', deleteList);
router.delete('/:listId/:listItemId', deleteListItem);

export default router;
