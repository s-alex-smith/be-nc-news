const {
  alterCommentVotes,
  deleteAComment,
} = require("../Models/comments.model");

exports.amendCommentById = (req, res, next) => {
  // console.log(req);
  let { comment_id } = req.params;
  let { inc_votes } = req.body;
  alterCommentVotes(comment_id, inc_votes)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.removeAComment = (req, res, next) => {
  let { comment_id } = req.params;
  deleteAComment(comment_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch(next);
};
