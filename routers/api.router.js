const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router.js");
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.route("/").all((req, res, next) => {
  res.status(405).send({ message: "Method not allowed" });
});

module.exports = apiRouter;
