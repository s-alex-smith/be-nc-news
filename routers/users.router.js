const usersRouter = require("express").Router();
const { getUserById } = require("../Controllers/users.controller");

usersRouter.route("/:username").get(getUserById);

module.exports = usersRouter;
