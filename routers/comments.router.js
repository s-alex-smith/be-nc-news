const commentsRouter = require("express").Router();
const {
  amendCommentById,
  removeAComment
} = require("../Controllers/comments.controller");

commentsRouter
  .route("/:comment_id")
  .patch(amendCommentById)
  .delete(removeAComment);

module.exports = commentsRouter;
