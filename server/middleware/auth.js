import User from '../models/user';

const auth = (req, res, next) => {
  let token = req.header('x-auth');
  console.log('Requested with token:',token)
  User.findByToken(token)
    .then( user => {
      if(!user){
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch( e => {
      let err = new Error('Needs authorization');
      err.status = 401;
      return next(err);
    });
}

export default auth;
