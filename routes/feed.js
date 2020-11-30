const express = require('express');
const feedController = require('../controllers/feed');

const router = express.Router();
router.get('/posts', feedController.getPosts);    //GET /feed/posts
router.post('/post', feedController.createPost);  //POST /feed/post

module.exports = router;