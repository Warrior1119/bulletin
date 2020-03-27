const httpStatus = require('http-status');
const User = require('../models/user.model');
const Post = require('../models/post.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const post = await Post.get(id);
    req.locals = { post };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.post.transform(req.user));

/**
 * Create new post
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const post = new Post(req.body);
    post.author = req.user;
    const savedPost = await post.save();
    res.status(httpStatus.CREATED);
    res.json(savedPost.transform(req.user));
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing post
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const { post } = req.locals;
    const newPost = Object.assign(post, req.body);
    const savedPost = await newPost.save();
    
    res.json(savedPost.transform(req.user));
  } catch (error) {
    next(error);
  }
};


/**
 * Get post list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const posts = await Post.list({ tag: req.query.tag, sort: req.query.sort }, req.user);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete post
 * @public
 */
exports.remove = (req, res, next) => {
  const { post } = req.locals;

  post.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};

/**
 * upvotes to post
 * @public
 */
exports.upvote = async (req, res, next) => {
  try {
    const { post } = req.locals;

    if (post.downvotes.includes(req.user._id)) {
      post.downvotes.pull(req.user._id);
    }

    if (!post.upvotes.includes(req.user._id)) {
      post.upvotes.push(req.user._id);
    }
    const savedPost = await post.save();
    res.json(savedPost.transform(req.user));

  } catch (error) {
    next(error);
  }
};

/**
 * downvotes to post
 * @public
 */
exports.downvote = async (req, res, next) => {
  try {
    const { post } = req.locals;

    if (post.upvotes.includes(req.user._id)) {
      post.upvotes.pull(req.user._id);
    }

    if (!post.downvotes.includes(req.user._id)) {
      post.downvotes.push(req.user._id);
    }
    const savedPost = await post.save();
    res.json(savedPost.transform(req.user));
  } catch (error) {
    next(error);
  }
};

exports.cancelvote = async (req, res, next) => {
  try {
    const { post } = req.locals;
    post.upvotes.pull(req.user._id);
    post.downvotes.pull(req.user._id);
    const savedPost = await post.save();
    res.json(savedPost.transform(req.user));
  } catch (error) {
    next(error);
  }
};

