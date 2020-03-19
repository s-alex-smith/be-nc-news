const topicsRouter = require("express").Router();
const { getAllTopics } = require("../Controllers/topics.controller");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all((req, res, next) => {
    res.status(405).send({ message: "Method not allowed" });
  });

module.exports = topicsRouter;
