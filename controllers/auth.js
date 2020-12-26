const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
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
  try {
    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashPassword,
      name: name
    });  
    newUser = await user.save();
    
    res.status(201).json({ message: 'User created successfully.', userId: newUser._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    };
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      const error = new Error('User or password invalid.')
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }
    loadedUser = user;

    const isEqual = await bcrypt.compare(password, user.password);
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

    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    };
    next(err);
  }
}

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('User does not exist.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    };
    next(err);
  }
}

exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User does not exist.');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();

    res.status(200).json({ message: 'User status updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    };
    next(err);
  }
}