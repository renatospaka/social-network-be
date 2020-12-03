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
