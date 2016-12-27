import express from 'express';

const router = express.Router();

// get /api returns all todos
router.get('/', (req, res) => {
  if(err){
    return next(err);
  }
  res.send('You have accessed the /api route')
});


export default router;
