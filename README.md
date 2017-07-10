*The application can be viewed and demo at https://vigorous-advice.surge.sh/*

# Honey Dew Backend

The backend is a NodeJs restful API. It is written with Babel, ES6, Express, Mongoose, and MongoDB.

It uses a simple middleware to protect endpoint with JWT. The JWT must be kept in a X-auth header for it to be read and decrypted by the API. To recieve JWT.

* POST /users with a JSON password and email fields. You will be returned a valid JWT.
* GET /users/me to return user information
* POST /users/logout to invalidate your JWT
* POST /users/login to return a valid JWT.

It has four primary endpoints for creating, reading, updating, and deleting Todo items. 

* GET /API/todos
* GET /API/todos/:id
* POST /API/todos
* DELETE /API/todos/:id
* PUT /API/


The API is currently live on heroku. 

## Development

In development is persisent logins with Facebook. Multiple Todolists. User interaction for social todo lists. 
