const { validationResult } = require('express-validator');

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

  // create a post in the database
  res
    .status(201)
    .json({
      message: 'Post created successfully',
      post: { 
        _id: new Date().toISOString(), 
        title: title, 
        content: content,
        creator: {
          name: 'Renato, o bonzão'
        },
        createdAt: new Date()
      }
    });
};
