import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import router from './routes';

const app = express();

//set up some logging and parsing middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

//serve static page
//app.use('/', express.static())

//api routes
app.use('/api',router);

//catch 404 errors
app.use((req, res, next) => {
  let err = new Error('Resources Not Found');
  err.status = 404;
  next(err)
})

//set up error handler
app.use((err, req, res, next) => {
  res.status( err.status || 500);
  res.send(err.message);
});


app.get('/', (req, res) => {

  res.send("Hello World");
});

app.listen(8000, ()=>{
  console.log("App is now listening on port 8000");
});
