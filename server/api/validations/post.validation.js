const Joi = require('joi');

module.exports = {


  // POST /api/posts
  createPost: {
    body: {
      title: Joi.string().required(),
      body: Joi.string(),
      tags: Joi.array().items(Joi.string()),
    },
  },

  // PUT /api/posts/:postId
  updatePost: {
    body: {
      title: Joi.string().required(),
      body: Joi.string(),
      tags: Joi.array().items(Joi.string()),
    },
    params: {
      postId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
