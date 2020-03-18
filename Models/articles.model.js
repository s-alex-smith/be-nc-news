const knex = require("../connection");

exports.selectArticleById = article_id => {
  return knex
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .count("comment_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id");
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

exports.selectArticleComments = article_id => {
  return knex
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .then(comments => {
      let newComments = { comments };
      return newComments.comments.map(comment => {
        delete comment.article_id;
        return comment;
      });
    });
};

exports.selectAllArticles = sort_by => {
  return knex
    .select("articles.*")
    .from("articles")
    .count("comment_id as comment_count")
    .modify(qb => {
      if(sort_by !=== undefined){
        return qb.where({sort_by})
      }
    })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(allArticles => {
      return allArticles.map(article => {
        delete article.body;
        return article;
      });
    });
};

// exports.postNewComment = (article_id, comment) => {
//   const getArticle = knex
//     .select("*")
//     .from("articles")
//     .where("article_id", "=", article_id);
//   const getUsers = knex
//     .select("*")
//     .from("users")
//     .where("username", comment.username);
//   const getComments = knex.select("*").from("comments");

//   return Promise.all([getArticle, getUsers, getComments]).then(promise => {
//     let [article] = promise[0];
//     let user = promise[1];
//     // let allComments = promise[2];
//     return knex
//       .insert(comment)
//       .into("comments")
//       .where(comment.username === user.username)
//       .then(data => {
//         return data;
//       });
//   });

//   // return knex
//   .insert(comment.body)
//   .into("comments")
//   .where(article_id === article_id && comment.username === username)
//   .returning("*");
// };
