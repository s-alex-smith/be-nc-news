const {
  selectArticleById,
  updateArticleVotes,
  selectArticleComments,
  selectAllArticles,
  deleteAComment,
  postNewComment
} = require("../Models/articles.model");

exports.getArticleById = (req, res, next) => {
  let { article_id } = req.params;
  selectArticleById(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.alterArticleVotes = (req, res, next) => {
  let { article_id } = req.params;
  let { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then(article => {
      res.status(202).send({ article });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  selectArticleComments(req.params.article_id, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles(req.query)
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.removeAComment = (req, res, next) => {
  deleteAComment(req.params.comment_id)
    .then(result => {
      res.status(204).send();
    })
    .catch(next);
};

exports.addNewComment = (req, res, next) => {
  let { article_id } = req.params;
  postNewComment(article_id, req.body)
    .then(comment => res.status(201).send({ comment }))
    .catch(next);
};
