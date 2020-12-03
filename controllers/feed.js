const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res
    .status(200)
    .json({
      posts: [{ 
        _id: '1',
        title: 'Firs Post', 
        content: 'This is the 1st post!!', 
        imageUrl: '../images/PatoBorracha.jpg',
        creator: {
          name: "Renatão, o bacana"
        },
        createdAt: new Date()
      }]
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (! errors.isEmpty()) {
    return res
      .status(422)
      .json({
          message: 'Validation failed. Entered data is invalid.',
          errors: errors.array()
      })
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title, 
    content: content,
    imageUrl: '../images/PatoBorracha.jpg',
    creator: {
      name: 'Renato, o bonzão'
    },
  });
  post
    .save()
    .then(result => {
      res
        .status(201)
        .json({
          message: 'Post created successfully',
          post: post
        });
    })
    .catch(err => console.log(err));
  // create a post in the database
  
};
