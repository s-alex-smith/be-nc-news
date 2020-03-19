const { selectUserById } = require("../Models/users.model");

exports.getUserById = (req, res, next) => {
  let { username } = req.params;
  selectUserById(username)
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};
