const commentsRouter = require("express").Router();
const blog = require("../models/blog");
const Comment = require("../models/comment");
const middleware = require("../utils/middleware");

commentsRouter.get("/", async (request, response) => {
  const comments = await Comment.find({})
    .populate("blog", {
      title: 1,
      author: 1,
    })
    .populate("user", { username: 1, name: 1 });
  response.json(comments);
});

commentsRouter.post(
  "/:id/comments",
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body;
    const user = request.user;
    const blogId = request.params.id;

    const comment = new Comment({
      blog: blogId,
      user: user._id,
      comment: body.comment,
    });

    const savedComment = await comment.save();

    const populatedComment = await Comment.findById(savedComment._id)
      .populate("blog", { title: 1, author: 1 })
      .populate("user", { username: 1, name: 1 });

    response.status(201).json(populatedComment);
  }
);

module.exports = commentsRouter;
