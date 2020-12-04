const express = require('express');
const { body } =  require('express-validator');
const feedController = require('../controllers/feed');

const router = express.Router();

//GET All /feed/posts
router.get('/posts', feedController.getPosts);    

//POST /feed/post
router.post(
  '/post', 
  [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
  ], 
  feedController.createPost
);  

//GET One /feed/post
router.get('/post/:postId', feedController.getPost);

//PUT Update One /feed/post
router.put(
  '/post/:postId', 
  [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
  ],
  feedController.updatePost
);

module.exports = router;