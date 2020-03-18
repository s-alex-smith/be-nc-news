const commentsRouter = require("express").Router();
const { amendCommentById } = require("../Controllers/comments.controller");

commentsRouter.route("/:comment_id").patch(amendCommentById);

module.exports = commentsRouter;
