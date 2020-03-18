const {
  selectArticleById,
  updateArticleVotes,
  selectArticleComments,
  selectAllArticles,
  postNewComment
} = require("../Models/articles.model");

exports.getArticleById = (req, res, next) => {
  let { article_id } = req.params;
  selectArticleById(article_id).then(([article]) => {
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

exports.getArticleComments = (req, res, next) => {
  let { article_id } = req.params;
  selectArticleComments(article_id).then(comments => {
    res.status(200).send({ comments });
  });
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles(req.query).then(result => {
    res.status(200).send(result);
  });
};

// exports.addNewComment = (req, res, next) => {
//   let { article_id } = req.params;
//   let comment = req.body;
//   postNewComment(article_id, comment).then(data => console.log(data));
// };
