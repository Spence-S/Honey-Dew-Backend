'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _routes = require('./routes/routes');

var _routes2 = _interopRequireDefault(_routes);

var _mongoose = require('./db/mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _todo = require('./models/todo');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/************************
Start database connection:
Here I set up a custom promise for the mongoose
connection to make things look prettier.
I am not sure if this will allow the
event emitter to listen for a database crash
as I believe is intended.
*************************/


/**************************
Import Database dependencies
***************************/
(0, _mongoose2.default)().then(function (result) {
  console.log(result);
}).catch(function (error) {
  console.log(error);
});

//set up express app
/**************************
This is the main entry point for our
"Todo" App. We start by importing
dependencies and
***************************/
var app = (0, _express2.default)();
var port = process.env.PORT || 8000;

//set up some logging and parsing middleware
//for the entire app
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());

//api routes
app.use('/api', _routes2.default);

/*************************
GET /
this is where we will
serve up the react front end
*************************/
app.get('/', function (req, res) {
  res.send("Hello World");
});

/*********************
catch 404 errors
**********************/
app.use(function (req, res, next) {
  var err = new Error('Resources Not Found');
  err.status = 404;
  next(err);
});

//set up error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message
  });
});

//start running app
app.listen(port, function () {
  console.log('App is now listening on port ' + port);
});