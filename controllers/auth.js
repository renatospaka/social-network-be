const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.')
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  bcrypt
    .hash(password, 12)
    .then(hashPassword => {
      const user = new User({
        email: email,
        password: hashPassword,
        name: name
      });
      return user.save();
    })
    .then(newUser => {
      res
      .status(201)
      .json({ message: 'User created successfully.', userId: newUser._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      };
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('controller', req.body.password);
  console.log('controller', req.body.email);
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('User or password invalid.')
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('User or password invalid.')
        error.statusCode = 401;
        error.data = errors.array();
        throw error;
      };

      const token = jwt.sign(
        {
          email: loadedUser.email, 
          userId: loadedUser._id.toString()
        }, 
        'someSuperHugeSecretFromHeaven', 
        { expiresIn: '1h' }
      );

      res
        .status(200)
        .json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      };
      next(err);
    });
}