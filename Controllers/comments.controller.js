const { alterCommentVotes } = require("../Models/comments.model");

exports.amendCommentById = (req, res, next) => {
  let { comment_id } = req.params;
  let { inc_votes } = req.body;
  alterCommentVotes(comment_id, inc_votes).then(comment => {
    res.status(202).send({ comment });
  });
};
