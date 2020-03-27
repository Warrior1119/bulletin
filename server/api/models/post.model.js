const mongoose = require("mongoose");
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");
const { omitBy, isNil } = require("lodash");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    tags: [{ type: String }],
    upvotes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User"
      }
    ],
    downvotes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

/**
 * Methods
 */
postSchema.method({
  transform(user = null) {
    const transformed = {};
    const fields = ["_id", "title", "body", "tags", "createdAt"];

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    transformed["upvotes"] = this.upvotes.length;
    transformed["downvotes"] = this.downvotes.length;
    if (user) {
      transformed["upvoted"] = this.upvotes.includes(user._id);
      transformed["downvoted"] = this.downvotes.includes(user._id);
    }

    return transformed;
  }
});

/**
 * Statics
 */
postSchema.statics = {
  /**
   * Get post
   *
   * @param {ObjectId} id - The objectId of post.
   * @returns {Promise<Post, APIError>}
   */
  async get(id) {
    try {
      let post;

      if (mongoose.Types.ObjectId.isValid(id)) {
        post = await this.findById(id).exec();
      }
      if (post) {
        return post;
      }

      throw new APIError({
        message: "Post does not exist",
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  list({ tag, sort }, user) {
    let project = {
      title: 1,
      body: 1,
      tags: 1,
      upvoted: { $in: [user._id, "$upvotes"] },
      downvoted: { $in: [user._id, "$downvotes"] },
      upvotes: { $size: "$upvotes" },
      downvotes: { $size: "$downvotes" },
      createdAt: 1,
      votes: {
        $subtract: [{ $size: "$upvotes" }, { $size: "$downvotes" }]
      }
    };

    let match = {};
    if (tag) {
      match = {
        tags: tag
      };
    }
    let sorts;
    if (sort == "votes") {
      sorts = { votes: -1 };
    } else if (sort == "title") {
      sorts = { title: 1 };
    } else {
      sorts = { createdAt: -1 };
    }
    console.log(sorts);
    return this.aggregate()
      .project(project)
      .match(match)
      .sort(sorts);
  }
};

/**
 * @typedef Post
 */
module.exports = mongoose.model("Post", postSchema);
