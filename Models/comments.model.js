const knex = require("../connection");

exports.alterCommentVotes = (comment_id, inc_votes) => {
  return knex
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .modify((qb) => {
      if (inc_votes !== undefined) {
        return qb.increment({ votes: inc_votes });
      }
    })
    .returning("*")
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Not found",
        });
      } else {
        return result;
      }
    });
};

exports.deleteAComment = (comment_id) => {
  return knex
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .returning("*")
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Comment does not exist",
        });
      } else {
        return knex("comments").where("comment_id", comment_id).del();
      }
    });
};
