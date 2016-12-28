import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todo_app');
var db = mongoose.connection;

function connectMongoose(){
    return new Promise((resolve, reject) => {
      db.on('error', () => {
        reject(Error('connection error'));
      });
      db.once('open', () => {
        resolve('we\'re connected!');
      });
  });
}

export default connectMongoose;
