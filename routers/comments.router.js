const commentsRouter = require("express").Router();
const {
  amendCommentById,
  removeAComment
} = require("../Controllers/comments.controller");

commentsRouter
  .route("/:comment_id")
  .patch(amendCommentById)
  .delete(removeAComment)
  .all((req, res, next) => {
    res.status(405).send({ message: "Method not allowed" });
  });

module.exports = commentsRouter;
