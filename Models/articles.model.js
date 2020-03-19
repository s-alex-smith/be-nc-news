const knex = require("../connection");

exports.selectArticleById = article_id => {
  return knex
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .count("comment_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({
          status: 400,
          message: "Article does not exist"
        });
      } else {
        return result;
      }
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return knex
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .update({ votes: inc_votes })
    .returning("*")
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({
          status: 400,
          message: "Article does not exist"
        });
      } else {
        return result;
      }
    });
};

exports.selectArticleComments = (article_id, query) => {
  const { sort_by, order } = query;
  return knex
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(comments => {
      let newComments = { comments };
      return newComments.comments.map(comment => {
        delete comment.article_id;
        return comment;
      });
    })
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({
          status: 400,
          message: "Article does not exist"
        });
      } else {
        return result;
      }
    });
};

exports.selectAllArticles = query => {
  const { sort_by, order, author, topic } = query;
  return knex
    .select(
      "articles.author",
      "articles.article_id",
      "articles.votes",
      "articles.title",
      "articles.topic",
      "articles.created_at"
    )
    .from("articles")
    .count("comment_id as comment_count")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(qb => {
      if (author !== undefined) {
        return qb.where({ "articles.author": author });
      }
    })
    .modify(qb => {
      if (topic !== undefined) {
        return qb.where({ "articles.topic": topic });
      }
    })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({
          status: 400,
          message: "Article does not exist"
        });
      } else {
        return result;
      }
    });
};

exports.postNewComment = (article_id, reqBody) => {
  let { username, body } = reqBody;
  return knex
    .insert({ body, author: username, article_id })
    .into("comments")
    .returning("*")
    .then(result => {
      return result;
    });
};
