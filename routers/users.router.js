const usersRouter = require("express").Router();
const { getUserById } = require("../Controllers/users.controller");

usersRouter
  .route("/:username")
  .get(getUserById)
  .all((req, res, next) => {
    res.status(405).send({ message: "Method not allowed" });
  });

module.exports = usersRouter;
