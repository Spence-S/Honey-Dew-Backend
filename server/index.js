/**************************
This is the main entry point for our
"Todo" App. We start by importing
dependencies and
***************************/
require('dotenv').config();

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { users, todos } from './routes';
import cors from 'cors';

/**************************
Import Database dependencies
***************************/
import connectMongoose from './db/mongoose';
import { Todo, User } from './models/todo';

/************************
Start database connection:
Here I set up a custom promise for the mongoose
connection to make things look prettier.
*************************/
connectMongoose()
  .then( result => {
    console.log(result);
  }).catch( error => {
    console.log(error);
  })

//set up express app
const app = express();
const port = process.env.PORT || 8000;

//set up some logging and parsing middleware
//for the entire app
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, '../public/build')));

//api routes
app.use('/api', todos);
app.use('/users', users)

/*************************
GET /
this is where we will
serve up the react front end
*************************/
// app.get('/', (req, res) => {
//   res.send(./public/build/index.html);
// });

/*********************
catch 404 errors
**********************/
app.use((req, res, next) => {
  let err = new Error('SORRY!!!! 404: These Resources Were Definitely Not Found');
  err.status = 404;
  next(err);
});

//set up error handler
app.use((err, req, res, next) => {
  res.status( err.status || 500);
    res.send({
      status: err.status,
      message: err.message,
      stack: err.stack
    });
});

//start running app
app.listen(port, ()=>{
  console.log(`App is now listening on port ${port}`);
});
