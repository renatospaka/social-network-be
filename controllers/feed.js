exports.getPosts = (req, res, next) => {
  res
    .status(200)
    .json({
      posts: [{ title: 'Firs Post', content: 'This is the 1st post!!' }]
    });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  // create a post in the database
  res
    .status(201)
    .json({
      message: 'Post created successfully',
      post: { id: new Date().toISOString(), title: title, content: content }
    });
};
