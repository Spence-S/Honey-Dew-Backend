import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/honey_dew');
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
