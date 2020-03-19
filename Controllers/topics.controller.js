const { selectAllTopics } = require("../Models/topics.model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
