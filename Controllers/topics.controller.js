const { selectAllTopics } = require("../Models/topics.model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then(topic => {
    res.status(200).send({ topic });
  });
};
