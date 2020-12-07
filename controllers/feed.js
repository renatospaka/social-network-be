const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post
    .find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post
        .find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', posts: posts, totalItems: totalItems });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      };
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed. Entered data is invalid.');
    error.statusCode = 422; // this is an arbitrary named variable
    throw error;
  }
  if (!req.file) {
    const error = new Error('Image not informed.');
    error.statusCode = 422; // this is an arbitrary named variable
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  const post = new Post({
    title: title, 
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: 'Renato, o bonzão'
    },
  });
  post
    .save()
    .then(result => {
      res
        .status(201)
        .json({ message: 'Post created successfully', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      };
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post does not exist.');
        error.statusCode = 404; // this is an arbitrary named variable
        throw error;
      }
      res
        .status(200)
        .json({ message: 'Post fetched', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      };
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed. Entered data is invalid.');
    error.statusCode = 422; // this is an arbitrary named variable
    throw error;
  }
  const content = req.body.content;
  const title = req.body.title;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  };
  if (!imageUrl) {
    const error = new Error('Image not informed.');
    error.statusCode = 422;  
    throw error;
  }
  Post
    .findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post does not exist.');
        error.statusCode = 404; // this is an arbitrary named variable
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(post => {
      res
        .status(200)
        .json({ message: 'Post updated successfully.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      };
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post
    .findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post does not exist.');
        error.statusCode = 404; // this is an arbitrary named variable
        throw error;
      }

      // check if is logged user

      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(post => {
      console.log(post);
      res
        .status(200)
        .json({ message: 'Post deleted successfully.' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      };
      next(err);
    });
};

const clearImage= filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};