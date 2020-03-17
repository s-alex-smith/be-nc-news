const { selectAllTopics } = require("../Models/topics.model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then(result => res.status(200).send(result));
};
