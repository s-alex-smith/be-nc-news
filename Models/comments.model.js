const knex = require("../connection");

exports.alterCommentVotes = (comment_id, inc_votes) => {
  return knex
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .update({ votes: inc_votes })
    .returning("*");
};

exports.deleteAComment = comment_id => {
  return knex
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .del();
};
