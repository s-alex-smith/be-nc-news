const articlesRouter = require("express").Router();
const {
  getArticleById,
  alterArticleVotes,
  addNewComment,
  getArticleComments,
  getAllArticles
} = require("../Controllers/articles.controller");

articlesRouter.route("/").get(getAllArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(alterArticleVotes);
articlesRouter
  .route("/:article_id/comments")
  // .post(addNewComment)
  .get(getArticleComments);

module.exports = articlesRouter;
