import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { users, todos, lists } from './routes';
import cors from 'cors';

// DB deps
import connectMongoose from './db/mongoose';
import { Todo, User } from './models/todo';

// connect to DB
connectMongoose()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });

//set up express app
const app = express();
const port = process.env.PORT || 8000;

//set up some logging and parsing middleware
//for the entire app
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../public/build')));

//api routes
app.use('/lists', lists);
app.use('/api', todos);
app.use('/users', users);

/*********************
catch 404 errors
**********************/
app.use((req, res, next) => {
  let err = new Error(
    'SORRY!!!! 404: These Resources Were Definitely Not Found'
  );
  err.status = 404;
  next(err);
});

//set up error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  // err.message = 'this is a message';
  console.log(err);
  console.log(err.message);
  res.send(err.message);
});

//start running app
app.listen(port, () => {
  console.log(`App is now listening on port ${port}`);
});
