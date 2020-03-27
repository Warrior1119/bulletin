const express = require('express');
const validate = require('express-validation');
const controller = require('../controllers/post.controller');
const { authorize } = require('../middlewares/auth');
const router = express.Router();
const { createPost, updatePost } = require('../validations/post.validation');

router.param('postId', controller.load);

router
  .route('/')
  .get(authorize(), controller.list)
  .post(authorize(), validate(createPost), controller.create);

router
  .route('/:postId/')
  .get(authorize(), controller.get)
  .put(authorize(), validate(updatePost), controller.update)
  .delete(authorize(), controller.remove);

router
  .route('/:postId/upvote')
  .post(authorize(), controller.upvote);

router
  .route('/:postId/downvote')
  .post(authorize(), controller.downvote);

router
  .route('/:postId/cancelvote')
  .post(authorize(), controller.cancelvote);

module.exports = router;