const knex = require("../connection");

exports.selectArticleById = article_id => {
  const getArticle = knex
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id);
  const getComments = knex
    .select("*")
    .from("comments")
    .where("article_id", article_id);

  return Promise.all([getArticle, getComments]).then(promise => {
    let [article] = promise[0];
    let comments = promise[1];
    article.comment_count = comments.length;
    return article;
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return knex
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .update({ votes: inc_votes })
    .returning("*");
};

exports.selectAllComments = article_id => {
  return knex
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id);
};

exports.postNewComment = (article_id, comment) => {
  return knex.insert(comment).into("comments");
};
