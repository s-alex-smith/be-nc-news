const topicsRouter = require("express").Router();
const { getAllTopics } = require("../Controllers/topics.controller");

topicsRouter.route("/").get(getAllTopics);

module.exports = topicsRouter;
