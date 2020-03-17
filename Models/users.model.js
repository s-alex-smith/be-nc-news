const knex = require("../connection");

exports.selectUserById = username => {
  return knex
    .select("*")
    .from("users")
    .modify(queryBuilder => {
      if (username !== undefined) {
        return queryBuilder.where("username", "=", username);
      }
    });
};
