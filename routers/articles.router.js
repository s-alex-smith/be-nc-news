const articlesRouter = require("express").Router();
const {
  getArticleById,
  alterArticleVotes,
  addNewComment,
  getArticleComments,
  getAllArticles
} = require("../Controllers/articles.controller");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all((req, res, next) => {
    res.status(405).send({ message: "Method not allowed" });
  });
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(alterArticleVotes)
  .all((req, res, next) => {
    res.status(405).send({ message: "Method not allowed" });
  });
articlesRouter
  .route("/:article_id/comments")
  .post(addNewComment)
  .get(getArticleComments)
  .all((req, res, next) => {
    res.status(405).send({ message: "Method not allowed" });
  });

module.exports = articlesRouter;
