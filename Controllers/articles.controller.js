const {
  selectArticleById,
  updateArticleVotes,
  postNewComment
} = require("../Models/articles.model");

exports.getArticleById = (req, res, next) => {
  let { article_id } = req.params;
  selectArticleById(article_id).then(article => {
    res.status(200).send({ article });
  });
};

exports.alterArticleVotes = (req, res, next) => {
  let { article_id } = req.params;
  let { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes).then(article => {
    res.status(202).send({ article });
  });
};

exports.addNewComment = (req, res, next) => {
  let { article_id } = req.params;
  let { comment } = req.body;
  postNewComments(article_id, comment).then(data => console.log(data));
};
