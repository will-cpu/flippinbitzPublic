const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a Post Failed!"
    });
  });
}

exports.updatePost =(req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if(result.n > 0){
      res.status(200).json({ message: "Update successful!" });
    }else{
      res.status(401).json({ message: "Not authorized" });
    }

  })
  .catch(error => {
    res.status(500).json({
      message: "Could'nt update Post!"
    });
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  let total;
  Post.countDocuments({}).then(count => {
  if (pageSize && currentPage) {
    total = count;
      if((total - (pageSize * (currentPage))) < 0){
        postQuery.skip(0).limit(pageSize + (total - (pageSize * (currentPage))));
      }
      else  {
      postQuery.skip(total - (pageSize * (currentPage))).limit(pageSize);
      //console.log(total - (pageSize * (currentPage)));
      //console.log(total);
    }
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      })
    });
  });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  });
}

exports.deletePosts = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if(result.n > 0){
      res.status(200).json({ message: "Deletion successful!" });
    }else{
      res.status(401).json({ message: "Not authorized" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Dailed!"
    })
  });
}
