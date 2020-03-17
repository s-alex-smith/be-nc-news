const articlesRouter = require("express").Router();
const {
  getArticleById,
  alterArticleVotes,
  addNewComment
} = require("../Controllers/articles.controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(alterArticleVotes);
articlesRouter.route("/:article_id/comments").post(addNewComment);

module.exports = articlesRouter;
